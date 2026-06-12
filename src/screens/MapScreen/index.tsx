import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Platform, ActivityIndicator, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../App';
import type { Game } from '../HomeScreen/types';
import { loadGames, upsertGame, loadGameState, saveGameState } from '../../storage/gameStorage';
import { GemMarker } from './types';
import { generateGemsOSM, repositionGem, distanceMeters, COLLECT_RADIUS_M, GLOW_RADIUS_M } from './utils';
import { createMapStyles, createCenterBtnStyles, createLoadingStyles } from './styles';
import GameHUD from './GameHUD';
import GemMarkerView from './GemMarkerView';
import GemTooltip from './GemTooltip';
import PermissionGate from './PermissionGate';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route, navigation }: Props) {
  const { gameId } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const s  = useMemo(() => createMapStyles(theme), [theme]);
  const cs = useMemo(() => createCenterBtnStyles(theme), [theme]);
  const ls = useMemo(() => createLoadingStyles(theme), [theme]);

  const [game, setGame] = useState<Game | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gems, setGems] = useState<GemMarker[]>([]);
  const [gemsLoading, setGemsLoading] = useState(false);
  const [gameCenter, setGameCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialCenter, setInitialCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedGem, setSelectedGem] = useState<GemMarker | null>(null);
  const [repositioning, setRepositioning] = useState(false);
  const [gemsReady, setGemsReady] = useState(false);
  const [repositionCount, setRepositionCount] = useState(0);

  const MAX_REPOSITIONS = 3;
  const gemsInitialized = useRef(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    loadGameState(gameId).then(state => {
      if (state) setInitialCenter(state.center);
    });
  }, [gameId]);

  useEffect(() => {
    loadGames().then(games => {
      const found = games.find(g => g.id === gameId) ?? null;
      setGame(found);
    });
  }, [gameId]);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted || !game) return;

    let subscription: Location.LocationSubscription;

    (async () => {
      const savedState = await loadGameState(gameId);

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 2 },
        loc => {
          const { latitude, longitude } = loc.coords;
          setUserLocation({ latitude, longitude });

          if (!gemsInitialized.current) {
            gemsInitialized.current = true;

            if (savedState) {
              setGameCenter(savedState.center);
              setInitialCenter(savedState.center);
              setGems(savedState.gems);
              setRepositionCount(savedState.repositionCount ?? 0);
              setGemsReady(true);
              mapRef.current?.animateToRegion({
                ...savedState.center,
                latitudeDelta: game.radius * 0.018,
                longitudeDelta: game.radius * 0.018,
              }, 800);
            } else {
              const center = { latitude, longitude };
              setGameCenter(center);
              setInitialCenter(center);
              setGemsLoading(true);

              mapRef.current?.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: game.radius * 0.018,
                longitudeDelta: game.radius * 0.018,
              }, 800);

              generateGemsOSM(latitude, longitude, game.radius).then(async generated => {
                setGems(generated);
                setGemsLoading(false);
                setGemsReady(true);
                await saveGameState(gameId, { center, gems: generated });
              });
            }
          }
        },
      );
    })();

    return () => { subscription?.remove(); };
  }, [permissionGranted, game]);

  const isNear = (gem: GemMarker) => {
    if (!userLocation || gem.collected) return false;
    return distanceMeters(userLocation.latitude, userLocation.longitude, gem.latitude, gem.longitude) <= GLOW_RADIUS_M;
  };

  const handleCenter = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    }, 600);
  };

  const selectedGemDistance = selectedGem && userLocation
    ? distanceMeters(userLocation.latitude, userLocation.longitude, selectedGem.latitude, selectedGem.longitude)
    : null;

  const handleGemTap = (gem: GemMarker) => setSelectedGem(gem);
  const handleDismiss = () => setSelectedGem(null);

  const handleConfirmCollect = async () => {
    if (!selectedGem || !game || !gameCenter) return;

    const updatedGems = gems.map(g => g.id === selectedGem.id ? { ...g, collected: true } : g);
    const gemsFound = updatedGems.filter(g => g.collected).length;
    const updatedGame: Game = {
      ...game,
      gemsFound,
      status: gemsFound === game.gemsTotal ? 'finished' : 'active',
    };

    setGems(updatedGems);
    setGame(updatedGame);
    setSelectedGem(null);

    await saveGameState(gameId, { center: gameCenter, gems: updatedGems });
    await upsertGame(updatedGame);

    if (updatedGame.status === 'finished') {
      navigation.replace('Victory', { gameId });
    }
  };

  const handleReposition = async () => {
    if (!selectedGem || !gameCenter || repositionCount >= MAX_REPOSITIONS) return;
    const gemId = selectedGem.id;
    const newCount = repositionCount + 1;
    setSelectedGem(null);
    setRepositioning(true);
    setRepositionCount(newCount);
    try {
      const newPos = await repositionGem(gameCenter.latitude, gameCenter.longitude, game?.radius ?? 0.5);
      const updatedGems = gems.map(g => g.id === gemId ? { ...g, ...newPos } : g);
      setGems(updatedGems);
      await saveGameState(gameId, { center: gameCenter, gems: updatedGems, repositionCount: newCount });
    } finally {
      setRepositioning(false);
    }
  };

  if (permissionGranted === false) {
    return <PermissionGate onRequest={requestPermission} />;
  }

  const radius = game?.radius ?? 0.5;
  const gameName = game?.name ?? 'Aventura';
  const mapStyle = theme.id === 'darkGold' ? DARK_MAP_STYLE : LIGHT_MAP_STYLE;

  return (
    <View style={[s.root, { paddingBottom: insets.bottom }]}>
      {initialCenter && (
        <MapView
          ref={mapRef}
          style={s.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}
          customMapStyle={mapStyle}
          initialRegion={{
            ...initialCenter,
            latitudeDelta: radius * 0.018,
            longitudeDelta: radius * 0.018,
          }}
        >
          {gameCenter && (
            <Circle
              center={gameCenter}
              radius={radius * 1000}
              strokeWidth={1.5}
              strokeColor={`${theme.accentPrimary}80`}
            />
          )}
          {gems.map(gem => (
            <GemMarkerView
              key={gem.id}
              gem={gem}
              isNear={isNear(gem)}
              onPress={handleGemTap}
            />
          ))}
        </MapView>
      )}

      <TouchableOpacity
        style={[cs.btn, { bottom: 122 + insets.bottom }]}
        activeOpacity={0.75}
        onPress={handleCenter}
      >
        <Feather
          name="navigation"
          size={20}
          color={userLocation ? theme.accentPrimary : `${theme.textPrimary}4D`}
        />
      </TouchableOpacity>

      <GameHUD
        gameName={gameName}
        gems={gems}
        topInset={insets.top}
        onBack={() => navigation.goBack()}
      />

      {!gemsReady && (
        <View style={ls.overlay}>
          <Text style={ls.text}>Cargando tu aventura...</Text>
          <ActivityIndicator size="large" color={theme.accentPrimary} />
          {gemsLoading && <Text style={ls.text}>Buscando zonas accesibles...</Text>}
        </View>
      )}

      <GemTooltip
        gem={selectedGem}
        distanceM={selectedGemDistance}
        canCollect={selectedGemDistance != null && selectedGemDistance <= COLLECT_RADIUS_M}
        repositioning={repositioning}
        repositionDisabled={repositionCount >= MAX_REPOSITIONS}
        repositionsLeft={repositionCount}
        onCollect={handleConfirmCollect}
        onReposition={handleReposition}
        onDismiss={handleDismiss}
      />
    </View>
  );
}

const DARK_MAP_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#0e1220' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0e1220' }] },
  { featureType: 'road',               elementType: 'geometry',           stylers: [{ color: '#1a2035' }] },
  { featureType: 'road',               elementType: 'geometry.stroke',    stylers: [{ color: '#0e1220' }] },
  { featureType: 'road',               elementType: 'labels.text.fill',   stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway',       elementType: 'geometry',           stylers: [{ color: '#2a3550' }] },
  { featureType: 'water',              elementType: 'geometry',           stylers: [{ color: '#050a14' }] },
  { featureType: 'water',              elementType: 'labels.text.fill',   stylers: [{ color: '#3d4d58' }] },
  { featureType: 'poi',                stylers: [{ visibility: 'off' }]  },
  { featureType: 'transit',            stylers: [{ visibility: 'off' }]  },
  { featureType: 'administrative',     elementType: 'geometry',           stylers: [{ color: '#1a2035' }] },
  { featureType: 'landscape',          elementType: 'geometry',           stylers: [{ color: '#0e1220' }] },
];

const LIGHT_MAP_STYLE = [
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water',   elementType: 'geometry', stylers: [{ color: '#d8c6f0' }] },
  { featureType: 'road',    elementType: 'geometry', stylers: [{ color: '#f5e6ff' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#fef3ff' }] },
];

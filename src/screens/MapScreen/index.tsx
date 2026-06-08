import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../App';
import type { Game } from '../HomeScreen/types';
import { loadGames, upsertGame, loadGameState, saveGameState } from '../../storage/gameStorage';
import { GemMarker, generateGemsOSM, distanceMeters, COLLECT_RADIUS_M, GLOW_RADIUS_M } from './types';
import { mapStyles as s, centerBtnStyles as cs } from './styles';
import GameHUD from './GameHUD';
import GemMarkerView from './GemMarkerView';
import CollectToast from './CollectToast';
import PermissionGate from './PermissionGate';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route, navigation }: Props) {
  const { gameId } = route.params;
  const insets = useSafeAreaInsets();

  const [game, setGame] = useState<Game | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gems, setGems] = useState<GemMarker[]>([]);
  const [gemsLoading, setGemsLoading] = useState(false);
  const [gameCenter, setGameCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingGem, setPendingGem] = useState<GemMarker | null>(null);
  const gemsInitialized = useRef(false);
  const mapRef = useRef<MapView>(null);

  // Load game summary from storage
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

  // Tracking GPS + gem initialization
  useEffect(() => {
    if (!permissionGranted || !game) return;

    let subscription: Location.LocationSubscription;

    (async () => {
      // Check if there's a saved state (resume)
      const savedState = await loadGameState(gameId);

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 2 },
        loc => {
          const { latitude, longitude } = loc.coords;
          setUserLocation({ latitude, longitude });

          if (!gemsInitialized.current) {
            gemsInitialized.current = true;

            if (savedState) {
              // Resume: load saved gems and center
              setGameCenter(savedState.center);
              setGems(savedState.gems);
              mapRef.current?.animateToRegion({
                ...savedState.center,
                latitudeDelta: game.radius * 0.018,
                longitudeDelta: game.radius * 0.018,
              }, 800);
            } else {
              // First launch: generate gems from current position
              const center = { latitude, longitude };
              setGameCenter(center);
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

  const handleGemTap = (gem: GemMarker) => {
    if (!userLocation) return;
    const dist = distanceMeters(userLocation.latitude, userLocation.longitude, gem.latitude, gem.longitude);
    if (dist > COLLECT_RADIUS_M) return;
    setPendingGem(gem);
  };

  const handleConfirmCollect = async () => {
    if (!pendingGem || !game || !gameCenter) return;

    const updatedGems = gems.map(g => g.id === pendingGem.id ? { ...g, collected: true } : g);
    const gemsFound = updatedGems.filter(g => g.collected).length;
    const updatedGame: Game = {
      ...game,
      gemsFound,
      status: gemsFound === game.gemsTotal ? 'finished' : 'active',
    };

    setGems(updatedGems);
    setGame(updatedGame);
    setPendingGem(null);

    await saveGameState(gameId, { center: gameCenter, gems: updatedGems });
    await upsertGame(updatedGame);
  };

  const handleDismissToast = () => {
    setPendingGem(null);
  };

  if (permissionGranted === false) {
    return <PermissionGate onRequest={requestPermission} />;
  }

  const radius = game?.radius ?? 0.5;
  const gameName = game?.name ?? 'Aventura';

  return (
    <View style={[s.root, { paddingBottom: insets.bottom }]}>
      <MapView
        ref={mapRef}
        style={s.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={{
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: radius * 0.018,
          longitudeDelta: radius * 0.018,
        }}
      >
        {gameCenter && (
          <Circle
            center={gameCenter}
            radius={radius * 1000}
            strokeWidth={1.5}
            strokeColor="rgba(255,215,0,0.5)"
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

      <TouchableOpacity
        style={[cs.btn, { bottom: 122 + insets.bottom }]}
        activeOpacity={0.75}
        onPress={handleCenter}
      >
        <Feather name="navigation" size={20} color={userLocation ? '#FFD700' : 'rgba(232,221,181,0.3)'} />
      </TouchableOpacity>

      <GameHUD
        gameName={gameName}
        gems={gems}
        topInset={insets.top}
        onBack={() => navigation.goBack()}
      />

      {gemsLoading && (
        <View style={loadingStyles.overlay}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={loadingStyles.text}>Buscando zonas accesibles...</Text>
        </View>
      )}

      <CollectToast
        gem={pendingGem}
        onCollect={handleConfirmCollect}
        onDismiss={handleDismissToast}
      />
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,11,20,0.75)',
    gap: 14,
  },
  text: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: '#E8DDB5',
    letterSpacing: 1.5,
  },
});

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

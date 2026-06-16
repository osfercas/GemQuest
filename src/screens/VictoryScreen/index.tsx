import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated, Text, TouchableOpacity, View,
} from 'react-native';
import { createStyles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../App';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { GEM_NAMES } from '../MapScreen/utils';
import type { GemMarker } from '../MapScreen/types';
import { loadGames, loadGameState } from '../../storage/gameStorage';
import type { Game } from '../HomeScreen/types';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Victory'>;

export default function VictoryScreen({ route, navigation }: Props) {
  const { gameId } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const [game, setGame] = useState<Game | null>(null);
  const [gems, setGems] = useState<GemMarker[]>([]);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const gemAnims  = useRef(GEM_NAMES.map(() => new Animated.Value(0))).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const btnAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const [games, state] = await Promise.all([loadGames(), loadGameState(gameId)]);
      setGame(games.find(g => g.id === gameId) ?? null);
      setGems(state?.gems ?? []);
    })();
  }, [gameId]);

  useEffect(() => {
    if (!game) return;

    titleAnim.setValue(0);
    gemAnims.forEach(a => a.setValue(0));
    statsAnim.setValue(0);
    btnAnim.setValue(0);

    Animated.sequence([
      Animated.delay(200),
      Animated.timing(titleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.stagger(80, gemAnims.map(anim =>
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 9 }),
      )),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(statsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(btnAnim,   { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [game]);

  const handleGoHome = () => {
    navigation.reset({ index: 1, routes: [{ name: 'Login' }, { name: 'Home' }] });
  };

  const row1 = GEM_NAMES.slice(0, 4);
  const row2 = GEM_NAMES.slice(4);

  const renderGem = (name: typeof GEM_NAMES[number], animIndex: number) => {
    const gem = gems.find(g => g.name === name);
    const collected = gem?.collected ?? false;
    const g = GEM_COLORS[name];
    const anim = gemAnims[animIndex];
    return (
      <Animated.View
        key={name}
        style={[s.gemSlot, {
          opacity: anim,
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        }]}
      >
        <GemShape
          color={collected ? g.color : `${theme.textPrimary}1F`}
          light={collected ? g.light : `${theme.textPrimary}33`}
          dark={collected ? g.dark  : `${theme.textPrimary}0F`}
          size={32}
        />
        <Text style={[s.gemLabel, collected && { color: g.light, opacity: 1 }]}>
          {name}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={theme.gradientGlow}
        style={s.glow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.65 }}
        pointerEvents="none"
      />

      <View style={s.content}>

        <Animated.View style={[s.titleBlock, {
          opacity: titleAnim,
          transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={s.titleEyebrow}>✦ Aventura ✦</Text>
          <Text style={s.titleBig}>Completada</Text>
          {game && <Text style={s.gameName}>{game.name}</Text>}
        </Animated.View>

        <View style={s.gemGrid}>
          <View style={s.gemRow}>
            {row1.map((name, i) => renderGem(name, i))}
          </View>
          <View style={s.gemRow}>
            {row2.map((name, i) => renderGem(name, 4 + i))}
          </View>
        </View>

        {game && (
          <Animated.View style={{ opacity: statsAnim }}>
            <Text style={s.statsText}>
              {game.gemsFound} de {game.gemsTotal} {theme.termGems.toLowerCase()} · {game.radius} km · {game.date}
            </Text>
          </Animated.View>
        )}

        <Animated.View style={[s.btnWrap, {
          opacity: btnAnim,
          transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }]}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleGoHome}>
            <LinearGradient
              colors={theme.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.btn}
            >
              <Text style={s.btnText}>Volver al Inicio</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { createHeroStyles } from './styles';
import { useTheme } from '../../theme/ThemeContext';

const DECO_GEMS = Object.keys(GEM_COLORS).slice(0, 5) as Array<keyof typeof GEM_COLORS>;

interface Props {
  onPress: () => void;
}

export default function HeroCard({ onPress }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createHeroStyles(theme), [theme]);
  const isAnime = theme.id === 'animeMagico';

  if (theme.id === 'mainQuest') {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
        <View style={s.card}>
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.jungleOverlay]} />

          <View style={s.content}>
            <View style={s.plusCircle}>
              <View style={[s.plusGradient, styles.jungleIcon]}>
                <Feather name="plus" size={26} color="#FFFFFF" />
              </View>
            </View>
            <Text style={[s.label, styles.jungleLabel]}>Nueva Partida</Text>
            <Text style={[s.sub, styles.jungleSub]}>Empieza una nueva aventura</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <LinearGradient
        colors={isAnime ? ['#FF6600', '#FFFFFF', '#FF6600'] : theme.gradientHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.card, isAnime && { borderColor: theme.accentSecondary }]}
      >
        <View style={s.glow} />

        <View style={s.content}>
          <View style={s.plusCircle}>
            {isAnime ? (
              <View style={[s.plusGradient, { backgroundColor: theme.accentSecondary }]}>
                <Feather name="plus" size={26} color="#FFFFFF" />
              </View>
            ) : (
              <LinearGradient colors={theme.gradientButton} style={s.plusGradient}>
                <Feather name="plus" size={26} color={theme.textOnAccent} />
              </LinearGradient>
            )}
          </View>
          <Text style={[s.label, isAnime && { color: theme.accentSecondary }]}>Nueva Partida</Text>
          <Text style={[s.sub, isAnime && { color: theme.accentSecondary, opacity: 0.75 }]}>Empieza una nueva aventura</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  jungleOverlay: {
    backgroundColor: 'rgba(223,241,184,0.9)',
  },
  jungleIcon: {
    backgroundColor: '#299259',
    shadowColor: '#299259',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 10,
  },
  jungleLabel: {
    color: '#1e3a24',
  },
  jungleSub: {
    color: '#4d7a3f',
    opacity: 1,
  },
});

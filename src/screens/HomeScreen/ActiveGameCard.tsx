import { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { GemVisual } from '../../components/GemVisual';
import { createActiveCardStyles } from './styles';
import { Game } from './types';
import { useGameStorage } from '../../storage/useGameStorage';
import type { GemMarker } from '../MapScreen/types';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  game: Game;
  onResume: () => void;
  onDelete: () => void;
}

function formatRadius(radius: number) {
  return radius < 1 ? `${radius * 1000} m` : `${radius} km`;
}

export default function ActiveGameCard({ game, onResume, onDelete }: Props) {
  const { theme } = useTheme();
  const isJungle = theme.id === 'mainQuest';
  const { loadGameState } = useGameStorage();
  const s = useMemo(() => createActiveCardStyles(theme), [theme]);
  const progress = game.gemsFound / game.gemsTotal;
  const [gemMarkers, setGemMarkers] = useState<GemMarker[]>([]);

  useEffect(() => {
    loadGameState(game.id).then(state => {
      if (state) setGemMarkers(state.gems);
    });
  }, [game.id]);

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.82}>
      <LinearGradient
        colors={isJungle ? ['rgba(41,146,89,0.10)', 'rgba(41,146,89,0.02)'] : [`${theme.accentPrimary}12`, `${theme.accentPrimary}04`]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Text style={[s.name, { flex: 1, marginRight: 6 }]} numberOfLines={1}>{game.name}</Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }} activeOpacity={0.7}>
          <Feather name="trash-2" size={14} color={`${theme.colorError}ac`} />
        </TouchableOpacity>
      </View>
      <Text style={s.radius}>{formatRadius(game.radius)}</Text>

      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={s.progressLabel}>{game.gemsFound}/{game.gemsTotal} {theme.termGems.toLowerCase()}</Text>

      <View style={s.gems}>
        {gemMarkers.map(gem => (
          <GemVisual
            key={gem.id}
            name={gem.name}
            size={12}
            collected={gem.collected}
            dimColor={isJungle ? 'rgba(30,58,36,0.45)' : undefined}
          />
        ))}
      </View>

      <TouchableOpacity style={s.resumeBtn} activeOpacity={0.8} onPress={onResume}>
        <LinearGradient
          colors={isJungle ? ['#299259', '#1e6b3f'] : theme.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.resumeGradient}
        >
          <Text style={s.resumeText}>Continuar</Text>
          <Feather name="arrow-right" size={12} color={isJungle ? '#FFFFFF' : theme.textOnAccent} />
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

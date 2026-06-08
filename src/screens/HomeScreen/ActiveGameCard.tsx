import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { activeCardStyles as s } from './styles';
import { Game } from './types';

interface Props {
  game: Game;
  onResume: () => void;
  onDelete: () => void;
}

function formatRadius(radius: number) {
  return radius < 1 ? `${radius * 1000} m` : `${radius} km`;
}

export default function ActiveGameCard({ game, onResume, onDelete }: Props) {
  const progress = game.gemsFound / game.gemsTotal;

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.82}>
      <LinearGradient
        colors={['rgba(255,215,0,0.07)', 'rgba(255,215,0,0.02)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Text style={[s.name, { flex: 1, marginRight: 6 }]} numberOfLines={1}>{game.name}</Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }} activeOpacity={0.7}>
          <Feather name="trash-2" size={14} color="rgba(255,107,107,0.55)" />
        </TouchableOpacity>
      </View>
      <Text style={s.radius}>{formatRadius(game.radius)}</Text>

      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={s.progressLabel}>{game.gemsFound}/{game.gemsTotal} gemas</Text>

      <View style={s.gems}>
        {game.gems.slice(0, 5).map(name => {
          const g = GEM_COLORS[name];
          return <GemShape key={name} color={g.color} light={g.light} dark={g.dark} size={12} />;
        })}
        {game.gems.length > 5 && (
          <Text style={s.moreGems}>+{game.gems.length - 5}</Text>
        )}
      </View>

      <TouchableOpacity style={s.resumeBtn} activeOpacity={0.8} onPress={onResume}>
        <LinearGradient
          colors={['#FFD700', '#C8860A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.resumeGradient}
        >
          <Text style={s.resumeText}>Continuar</Text>
          <Feather name="arrow-right" size={12} color="#0A0D1A" />
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

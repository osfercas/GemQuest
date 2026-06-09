import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { heroStyles as s } from './styles';

const DECO_GEMS = Object.keys(GEM_COLORS).slice(0, 5) as Array<keyof typeof GEM_COLORS>;

interface Props {
  onPress: () => void;
}

export default function HeroCard({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <LinearGradient
        colors={['#1A1400', '#2A2000', '#1A1400']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.card}
      >
        <View style={s.glow} />

        <View style={s.content}>
          <View style={s.plusCircle}>
            <LinearGradient colors={['#FFD700', '#C8860A']} style={s.plusGradient}>
              <Feather name="plus" size={26} color="#0A0D1A" />
            </LinearGradient>
          </View>
          <Text style={s.label}>Nueva Partida</Text>
          <Text style={s.sub}>Empieza una nueva aventura</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

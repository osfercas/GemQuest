import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const GEM_COLORS = {
  Ruby:       { color: '#FF6B6B', light: '#FF9999', dark: '#AA1100' },
  Diamond:    { color: '#E8E8F0', light: '#FFFFFF', dark: '#9090B0' },
  Emerald:    { color: '#6BCB77', light: '#A8E6B0', dark: '#1E6B2E' },
  Sapphire:   { color: '#4D96FF', light: '#90C0FF', dark: '#1040CC' },
  Amethyst:   { color: '#C77DFF', light: '#E0AAFF', dark: '#6B10CC' },
  Amber:      { color: '#FF9F1C', light: '#FFC870', dark: '#BB5500' },
  Aquamarine: { color: '#00D2FF', light: '#80E9FF', dark: '#0088CC' },
} as const;

export type GemName = keyof typeof GEM_COLORS;

interface Props {
  color: string;
  light: string;
  dark: string;
  size: number;
}

export function GemShape({ color, light, dark, size }: Props) {
  const w    = Math.round(size * 0.62);
  const half = Math.round(w / 2);
  const topH = Math.round(size * 0.34);
  const midH = Math.round(size * 0.32);
  const botH = Math.round(size * 0.34);

  return (
    <View
      style={{
        width: size + 12,
        height: size + 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        shadowRadius: size * 0.45,
        elevation: 8,
      }}
    >
      <View style={{ alignItems: 'center', width: w, height: topH + midH + botH }}>

        {/* Punta superior */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: half,
            borderRightWidth: half,
            borderBottomWidth: topH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: light,
          }}
        />

        {/* Cuerpo central con gradiente */}
        <LinearGradient
          colors={[light, color, dark]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ width: w, height: midH, marginTop: -1 }}
        />

        {/* Punta inferior */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: half,
            borderRightWidth: half,
            borderTopWidth: botH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: dark,
            marginTop: -1,
          }}
        />

      </View>
    </View>
  );
}

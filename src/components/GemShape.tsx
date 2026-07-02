import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const DRAGON_BALL_COLORS = {
  glow: '#FF6600',
  gradient: ['#FFDD00', '#FF8800', '#CC3300'] as const,
  star: '#CC0000',
};

const STAR_POSITIONS: Array<Array<{ x: number; y: number }>> = [
  [],
  [{ x: 0.5, y: 0.45 }],
  [{ x: 0.38, y: 0.35 }, { x: 0.62, y: 0.55 }],
  [{ x: 0.5, y: 0.3 }, { x: 0.35, y: 0.55 }, { x: 0.65, y: 0.55 }],
  [{ x: 0.36, y: 0.35 }, { x: 0.64, y: 0.35 }, { x: 0.36, y: 0.6 }, { x: 0.64, y: 0.6 }],
  [{ x: 0.25, y: 0.4 }, { x: 0.75, y: 0.4 }, { x: 0.5, y: 0.25 }, { x: 0.35, y: 0.68 }, { x: 0.65, y: 0.68 }],
  [{ x: 0.25, y: 0.4 }, { x: 0.75, y: 0.4 }, { x: 0.5, y: 0.25 }, { x: 0.35, y: 0.68 }, { x: 0.65, y: 0.68 }, { x: 0.5, y: 0.5 }],
  [{ x: 0.35, y: 0.3 }, { x: 0.65, y: 0.3 }, { x: 0.25, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.5 }, { x: 0.35, y: 0.7 }, { x: 0.65, y: 0.7 }],
];

export function DragonBallShape({ size, stars }: Readonly<{ size: number; stars: number }>) {
  const ballSize = size;
  const radius = ballSize / 2;
  const starSize = Math.max(4, Math.round(ballSize * 0.14));
  const positions = STAR_POSITIONS[Math.min(Math.max(stars, 1), 7)];

  return (
    <View
      style={{
        width: ballSize,
        height: ballSize,
        borderRadius: radius,
        shadowColor: DRAGON_BALL_COLORS.glow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.95,
        shadowRadius: size * 0.65,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={DRAGON_BALL_COLORS.gradient}
        start={{ x: 0.15, y: 0.05 }}
        end={{ x: 0.85, y: 0.95 }}
        style={{ width: ballSize, height: ballSize, borderRadius: radius }}
      >
        {/* Reflejo principal de cristal */}
        <View
          style={{
            position: 'absolute',
            top: ballSize * 0.1,
            left: ballSize * 0.16,
            width: ballSize * 0.38,
            height: ballSize * 0.2,
            borderRadius: ballSize * 0.12,
            backgroundColor: 'rgba(255,255,255,0.6)',
            transform: [{ rotate: '-25deg' }],
          }}
        />
        {/* Brillo secundario pequeño */}
        <View
          style={{
            position: 'absolute',
            top: ballSize * 0.3,
            left: ballSize * 0.14,
            width: ballSize * 0.14,
            height: ballSize * 0.08,
            borderRadius: ballSize * 0.06,
            backgroundColor: 'rgba(255,255,255,0.3)',
            transform: [{ rotate: '-25deg' }],
          }}
        />
        {/* Estrellas */}
        {positions.map((pos) => (
          <View
            key={`${pos.x}-${pos.y}`}
            style={{
              position: 'absolute',
              left: ballSize * pos.x - starSize / 2,
              top: ballSize * pos.y - starSize / 2,
            }}
          >
            <Ionicons name="star" size={starSize} color={DRAGON_BALL_COLORS.star} />
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

export const GEM_COLORS = {
  Ruby: { color: '#FF6B6B', light: '#FF9999', dark: '#AA1100' },
  Diamond: { color: '#E8E8F0', light: '#FFFFFF', dark: '#9090B0' },
  Emerald: { color: '#6BCB77', light: '#A8E6B0', dark: '#1E6B2E' },
  Sapphire: { color: '#4D96FF', light: '#90C0FF', dark: '#1040CC' },
  Amethyst: { color: '#C77DFF', light: '#E0AAFF', dark: '#6B10CC' },
  Amber: { color: '#FF9F1C', light: '#FFC870', dark: '#BB5500' },
  Aquamarine: { color: '#00D2FF', light: '#80E9FF', dark: '#0088CC' },
} as const;

export type GemName = keyof typeof GEM_COLORS;

const GEM_NAME_ORDER = Object.keys(GEM_COLORS) as GemName[];

export function getDragonBallStars(name: GemName): number {
  return GEM_NAME_ORDER.indexOf(name) + 1;
}

interface Props {
  color: string;
  light: string;
  dark: string;
  size: number;
}

export function GemShape({ color, light, dark, size }: Readonly<Props>) {
  const w = Math.round(size * 0.62);
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

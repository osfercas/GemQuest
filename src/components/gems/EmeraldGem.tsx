import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine } from './gemGradientMath';

// 8 facetas trapezoidales (anillo exterior -> interior), colores planos como en el CSS.
const FACETS = [
  { points: '19,0 81,0 68.6,20 31.4,20',       color: '#a9d47a' }, // top
  { points: '81,0 100,19 80,31.4 68.6,20',     color: '#8ec25c' }, // top-right
  { points: '100,19 100,81 80,68.6 80,31.4',   color: '#6ba33f' }, // right
  { points: '100,81 81,100 68.6,80 80,68.6',   color: '#5c9235' }, // bottom-right
  { points: '81,100 19,100 31.4,80 68.6,80',   color: '#4e7f2c' }, // bottom
  { points: '19,100 0,81 20,68.6 31.4,80',     color: '#5f9438' }, // bottom-left
  { points: '0,81 0,19 20,31.4 20,68.6',       color: '#79b048' }, // left
  { points: '0,19 19,0 31.4,20 20,31.4',       color: '#94c463' }, // top-left
];

// La "table" comparte lienzo (inset:0) con las facetas, así que su gradiente se
// calcula relativo a la caja completa 100x100, no a su propio bounding box.
const TABLE_POINTS = '31.4,20 68.6,20 80,31.4 80,68.6 68.6,80 31.4,80 20,68.6 20,31.4';

interface Props {
  size: number;
  collected?: boolean;
}

export function EmeraldGem({ size, collected = true }: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        shadowColor: '#3C7828',
        shadowOffset: { width: (size * 10) / 330, height: (size * 14) / 330 },
        shadowOpacity: collected ? 0.28 : 0,
        shadowRadius: (size * 10) / 330,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="emeraldTable" gradientUnits="userSpaceOnUse" {...angleGradientLine(145)}>
            <Stop offset="0"    stopColor="#c8e8a6" />
            <Stop offset="0.45" stopColor="#a0cf72" />
            <Stop offset="0.75" stopColor="#82ba50" />
            <Stop offset="1"    stopColor="#6ba33f" />
          </LinearGradient>
        </Defs>

        {FACETS.map((facet) => (
          <Polygon
            key={facet.points}
            points={facet.points}
            fill={collected ? facet.color : `${theme.textPrimary}26`}
          />
        ))}

        <Polygon points={TABLE_POINTS} fill={collected ? 'url(#emeraldTable)' : `${theme.textPrimary}26`} />
      </Svg>

      <GemSparkle width={size} left={0.12} top={0.08} box={60 / 330} delay={0}   gradientId="emeraldSparkle1" dim={!collected} />
      <GemSparkle width={size} left={0.6}  top={0.58} box={44 / 330} delay={900} gradientId="emeraldSparkle2" dim={!collected} />
    </View>
  );
}

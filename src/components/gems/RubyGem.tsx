import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';

// Facetas del cuerpo: 4 triángulos desde el centro (50,50) a cada vértice del rombo,
// replicando las 4 paradas duras del conic-gradient de ruby-gem.html.
const BODY_FACETS = [
  { points: '50,50 50,6 94,50', color: '#f06d7d' },  // 0-90deg
  { points: '50,50 94,50 50,94', color: '#c81e30' },  // 90-180deg
  { points: '50,50 50,94 6,50', color: '#e23f50' },  // 180-270deg
  { points: '50,50 6,50 50,6', color: '#f7a6af' },  // 270-360deg
];

const TABLE_POINTS = '50,24 76,50 50,76 24,50';

interface Props {
  size: number;
  collected?: boolean;
  dimColor?: string;
}

export function RubyGem({ size, collected = true, dimColor }: Readonly<Props>) {
  const { theme } = useTheme();
  const dim = dimColor ?? `${theme.textPrimary}4D`;

  return (
    <View
      style={{
        width: size,
        height: size,
        shadowColor: '#D62B3F',
        shadowOffset: { width: (size * 14) / 320, height: (size * 16) / 320 },
        shadowOpacity: collected ? 0.28 : 0,
        shadowRadius: (size * 10) / 320,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="rubyTable" x1="15%" y1="0%" x2="85%" y2="100%">
            <Stop offset="0"    stopColor="#ffc2c9" />
            <Stop offset="0.38" stopColor="#f47888" />
            <Stop offset="0.7"  stopColor="#e23f50" />
            <Stop offset="1"    stopColor="#c81e30" />
          </LinearGradient>
        </Defs>

        {BODY_FACETS.map((facet) => (
          <Polygon
            key={facet.points}
            points={facet.points}
            fill={collected ? facet.color : dim}
          />
        ))}

        <Polygon points={TABLE_POINTS} fill={collected ? 'url(#rubyTable)' : dim} />
      </Svg>

      <GemSparkle width={size} left={0.24} top={0.26} box={0.16875} delay={0}   gradientId="rubySparkle1" dim={!collected} />
      <GemSparkle width={size} left={0.6}  top={0.54} box={0.125}   delay={900} gradientId="rubySparkle2" dim={!collected} />
    </View>
  );
}

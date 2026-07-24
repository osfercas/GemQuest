import { View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine } from './gemGradientMath';

// 8 facetas trapezoidales (anillo exterior -> interior), colores planos como en el CSS.
const FACETS = [
  { points: '29.3,0 70.7,0 62,21 38,21',       color: '#5aa9dc' }, // top
  { points: '70.7,0 100,29.3 79,38 62,21',     color: '#2b8fc8' }, // top-right
  { points: '100,29.3 100,70.7 79,62 79,38',   color: '#1a6aa8' }, // right
  { points: '100,70.7 70.7,100 62,79 79,62',   color: '#0f4f82' }, // bottom-right
  { points: '70.7,100 29.3,100 38,79 62,79',   color: '#0c3f6e' }, // bottom
  { points: '29.3,100 0,70.7 21,62 38,79',     color: '#146794' }, // bottom-left
  { points: '0,70.7 0,29.3 21,38 21,62',       color: '#2f86c0' }, // left
  { points: '0,29.3 29.3,0 38,21 21,38',       color: '#4a9fd0' }, // top-left
];

// La "table" comparte lienzo (inset:0) con las facetas, así que su gradiente se
// calcula relativo a la caja completa 100x100, no a su propio bounding box.
const TABLE_POINTS = '38,21 62,21 79,38 79,62 62,79 38,79 21,62 21,38';

// El octógono original tiene el borde plano arriba/abajo/izq/dcha (vértices en las
// diagonales). Se rota 22.5° (medio paso de las 8 facetas) para que un vértice quede
// justo en el eje vertical, y se reescala por cos(22.5°) para que ese vértice siga
// tocando el borde de la caja (el vértice queda más lejos del centro que el punto
// medio de una arista, así que sin este ajuste se saldría del viewBox).
const CENTER = 50;
const ROTATE_DEG = 22.5;
const ROTATE_SCALE = Math.cos((ROTATE_DEG * Math.PI) / 180);
const OCTAGON_TRANSFORM =
  `translate(${CENTER},${CENTER}) scale(${ROTATE_SCALE}) rotate(${ROTATE_DEG}) translate(${-CENTER},${-CENTER})`;

interface Props {
  size: number;
  collected?: boolean;
  dimColor?: string;
}

export function SapphireGem({ size, collected = true, dimColor }: Readonly<Props>) {
  const { theme } = useTheme();
  const dim = dimColor ?? `${theme.textPrimary}4D`;

  return (
    <View
      style={{
        width: size,
        height: size,
        shadowColor: '#145082',
        shadowOffset: { width: (size * 10) / 330, height: (size * 14) / 330 },
        shadowOpacity: collected ? 0.28 : 0,
        shadowRadius: (size * 10) / 330,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="sapphireTable" gradientUnits="userSpaceOnUse" {...angleGradientLine(145)}>
            <Stop offset="0"    stopColor="#dcf0fc" />
            <Stop offset="0.3"  stopColor="#9fd0ef" />
            <Stop offset="0.65" stopColor="#57a6dc" />
            <Stop offset="1"    stopColor="#0f4f82" />
          </LinearGradient>
        </Defs>

        <G transform={OCTAGON_TRANSFORM}>
          {FACETS.map((facet) => (
            <Polygon
              key={facet.points}
              points={facet.points}
              fill={collected ? facet.color : dim}
            />
          ))}

          <Polygon points={TABLE_POINTS} fill={collected ? 'url(#sapphireTable)' : dim} />
        </G>
      </Svg>

      <GemSparkle width={size} left={0.12} top={0.08} box={60 / 330} delay={0}   gradientId="sapphireSparkle1" dim={!collected} />
      <GemSparkle width={size} left={0.6}  top={0.58} box={44 / 330} delay={900} gradientId="sapphireSparkle2" dim={!collected} />
    </View>
  );
}

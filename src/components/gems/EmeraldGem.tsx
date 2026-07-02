import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine } from './gemGradientMath';

// Octógono con 4 lados cortos (arriba/abajo/izq/dcha) y 4 largos (diagonales), donde
// el corto mide exactamente la mitad del largo. Los 8 vértices están sobre un mismo
// círculo de radio OUTER_R; alternando el hueco angular entre vértices consecutivos
// (2·ALPHA para los lados cortos, 90°-2·ALPHA para los largos) se controla la relación
// de longitudes: cuerda = 2·R·sin(hueco/2), así que 2·sin(ALPHA) = sin(45°-ALPHA)
// (mitad de longitud) da ALPHA = atan((2√2-1)/7).
const CENTER = 50;
const ALPHA_RAD = Math.atan((2 * Math.sqrt(2) - 1) / 7);
const ALPHA_DEG = (ALPHA_RAD * 180) / Math.PI;
const OUTER_APOTHEM = 48; // distancia centro -> lado corto de arriba
const INNER_APOTHEM = OUTER_APOTHEM * 0.62;
const OUTER_R = OUTER_APOTHEM / Math.cos(ALPHA_RAD);
const INNER_R = INNER_APOTHEM / Math.cos(ALPHA_RAD);
// Vértices en pares ±ALPHA alrededor de cada dirección cardinal (0/90/180/270): el
// hueco corto queda centrado en la cardinal (arriba, etc.) y el largo en la diagonal.
// Orden horario desde arriba: top, tr, r, br, bot, bl, l, tl (igual que el CSS original).
const VERTEX_ANGLES = [-ALPHA_DEG, ALPHA_DEG, 90 - ALPHA_DEG, 90 + ALPHA_DEG, 180 - ALPHA_DEG, 180 + ALPHA_DEG, 270 - ALPHA_DEG, 270 + ALPHA_DEG];

function octPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return `${CENTER + radius * Math.sin(rad)},${CENTER - radius * Math.cos(rad)}`;
}

const OUTER = VERTEX_ANGLES.map((a) => octPoint(a, OUTER_R));
const INNER = VERTEX_ANGLES.map((a) => octPoint(a, INNER_R));

// 8 facetas trapezoidales (anillo exterior -> interior), mismos colores planos del CSS
// original, reposicionados sobre la geometría regular.
const COLORS = ['#a9d47a', '#8ec25c', '#6ba33f', '#5c9235', '#4e7f2c', '#5f9438', '#79b048', '#94c463'];

const FACETS = COLORS.map((color, i) => ({
  color,
  points: `${OUTER[i]} ${OUTER[(i + 1) % 8]} ${INNER[(i + 1) % 8]} ${INNER[i]}`,
}));

// La "table" comparte lienzo (inset:0) con las facetas, así que su gradiente se
// calcula relativo a la caja completa 100x100, no a su propio bounding box.
const TABLE_POINTS = INNER.join(' ');

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

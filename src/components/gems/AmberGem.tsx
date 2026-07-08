import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine } from './gemGradientMath';

// El diseño original (basado en % a mano) no era un hexágono perfectamente regular.
// Aquí se construye uno de verdad: 6 vértices a 60° exactos, orientación "punta arriba"
// (vértice en 0°, no borde plano), con un anillo exterior (facetas) y uno interior (tabla)
// concéntricos y proporcionales.
const CENTER = 50;
const OUTER_R = 48;
const INNER_R = OUTER_R * 0.62;
const ANGLES = [0, 60, 120, 180, 240, 300];

function hexPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return `${CENTER + radius * Math.sin(rad)},${CENTER - radius * Math.cos(rad)}`;
}

const OUTER = ANGLES.map((a) => hexPoint(a, OUTER_R));
const INNER = ANGLES.map((a) => hexPoint(a, INNER_R));

// Cada arista del hexágono es una faceta trapezoidal (borde exterior -> interior).
// Se reutilizan las 6 paletas de color del diseño original, reposicionadas a la nueva
// geometría regular (misma iluminación relativa: más clara arriba, más oscura abajo).
const SIDES = [
  { id: 'amberCeiling', angle: 100, stops: [{ o: 0, c: '#fde8ca' }, { o: 0.45, c: '#fccd8f' }, { o: 1, c: '#f7941d' }] },
  { id: 'amberWallR',   angle: 245, stops: [{ o: 0, c: '#fdbf6c' }, { o: 0.55, c: '#fba540' }, { o: 1, c: '#e98a23' }] },
  { id: 'amberLowerR',  angle: 255, stops: [{ o: 0, c: '#ef9a35' }, { o: 0.55, c: '#da831c' }, { o: 1, c: '#bd6f12' }] },
  { id: 'amberFloor',   angle: 0,   stops: [{ o: 0, c: '#a86311' }, { o: 1, c: '#b96f18' }] },
  { id: 'amberLowerL',  angle: 115, stops: [{ o: 0, c: '#fcc079' }, { o: 0.55, c: '#fbac50' }, { o: 1, c: '#ef9a35' }] },
  { id: 'amberWallL',   angle: 105, stops: [{ o: 0, c: '#fdd49a' }, { o: 0.55, c: '#fbc077' }, { o: 1, c: '#f3a64d' }] },
];

const FACETS = SIDES.map((side, i) => ({
  ...side,
  points: `${OUTER[i]} ${OUTER[(i + 1) % 6]} ${INNER[(i + 1) % 6]} ${INNER[i]}`,
}));

const CENTER_FACET = {
  id: 'amberCenter',
  angle: 125,
  stops: [{ o: 0, c: '#ffd89b' }, { o: 0.32, c: '#fbb45f' }, { o: 0.66, c: '#f39a34' }, { o: 1, c: '#d97e18' }],
  points: INNER.join(' '),
};

const ALL_FACETS = [...FACETS, CENTER_FACET];

const SHEEN_POINTS = OUTER.join(' ');

interface Props {
  size: number;
  collected?: boolean;
  dimColor?: string;
}

export function AmberGem({ size, collected = true, dimColor }: Readonly<Props>) {
  const { theme } = useTheme();
  const dim = dimColor ?? `${theme.textPrimary}4D`;

  return (
    <View
      style={{
        width: size,
        height: size,
        shadowColor: '#965A14',
        shadowOffset: { width: (size * 10) / 330, height: (size * 14) / 330 },
        shadowOpacity: collected ? 0.28 : 0,
        shadowRadius: (size * 10) / 330,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {ALL_FACETS.map((facet) => {
            const line = angleGradientLine(facet.angle);
            return (
              <LinearGradient
                key={facet.id}
                id={facet.id}
                gradientUnits="userSpaceOnUse"
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              >
                {facet.stops.map((stop) => (
                  <Stop key={stop.o} offset={stop.o} stopColor={stop.c} />
                ))}
              </LinearGradient>
            );
          })}
          <LinearGradient
            id="amberSheen"
            gradientUnits="userSpaceOnUse"
            {...angleGradientLine(155)}
          >
            <Stop offset="0"    stopColor="#fffaf4" stopOpacity={0.35} />
            <Stop offset="0.22" stopColor="#fffaf4" stopOpacity={0.05} />
            <Stop offset="0.4"  stopColor="#fffaf4" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {ALL_FACETS.map((facet) => (
          <Polygon
            key={facet.id}
            points={facet.points}
            fill={collected ? `url(#${facet.id})` : dim}
          />
        ))}

        {collected && <Polygon points={SHEEN_POINTS} fill="url(#amberSheen)" />}
      </Svg>

      <GemSparkle width={size} left={0.18} top={0.08} box={0.18788} delay={0}   gradientId="amberSparkle1" dim={!collected} />
      <GemSparkle width={size} left={0.62} top={0.54} box={0.13939} delay={900} gradientId="amberSparkle2" dim={!collected} />
    </View>
  );
}

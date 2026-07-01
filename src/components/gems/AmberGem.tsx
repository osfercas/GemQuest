import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine } from './gemGradientMath';

// Todas las facetas son divs `inset: 0` recortados por clip-path, así que en CSS
// comparten un único fondo (mismo lienzo 100x100) en vez de tener cada una su propio
// gradiente — por eso usamos userSpaceOnUse con las mismas coordenadas para todas.
const FACETS = [
  {
    id: 'amberCeiling',
    points: '27,4 73,4 64,21.5 36,21.5',
    angle: 100,
    stops: [{ o: 0, c: '#fde8ca' }, { o: 0.45, c: '#fccd8f' }, { o: 1, c: '#f7941d' }],
  },
  {
    id: 'amberWallL',
    points: '27,4 36,21.5 20,50 1,50',
    angle: 105,
    stops: [{ o: 0, c: '#fdd49a' }, { o: 0.55, c: '#fbc077' }, { o: 1, c: '#f3a64d' }],
  },
  {
    id: 'amberLowerL',
    points: '1,50 20,50 36,78.5 27,96',
    angle: 115,
    stops: [{ o: 0, c: '#fcc079' }, { o: 0.55, c: '#fbac50' }, { o: 1, c: '#ef9a35' }],
  },
  {
    id: 'amberWallR',
    points: '73,4 99,50 80,50 64,21.5',
    angle: 245,
    stops: [{ o: 0, c: '#fdbf6c' }, { o: 0.55, c: '#fba540' }, { o: 1, c: '#e98a23' }],
  },
  {
    id: 'amberLowerR',
    points: '99,50 73,96 64,78.5 80,50',
    angle: 255,
    stops: [{ o: 0, c: '#ef9a35' }, { o: 0.55, c: '#da831c' }, { o: 1, c: '#bd6f12' }],
  },
  {
    id: 'amberFloor',
    points: '27,96 36,78.5 64,78.5 73,96',
    angle: 0,
    stops: [{ o: 0, c: '#a86311' }, { o: 1, c: '#b96f18' }],
  },
  {
    id: 'amberCenter',
    points: '36,21.5 64,21.5 80,50 64,78.5 36,78.5 20,50',
    angle: 125,
    stops: [{ o: 0, c: '#ffd89b' }, { o: 0.32, c: '#fbb45f' }, { o: 0.66, c: '#f39a34' }, { o: 1, c: '#d97e18' }],
  },
];

const SHEEN_POINTS = '27,4 73,4 99,50 73,96 27,96 1,50';

interface Props {
  size: number;
  collected?: boolean;
}

export function AmberGem({ size, collected = true }: Readonly<Props>) {
  const { theme } = useTheme();

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
          {FACETS.map((facet) => {
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

        {FACETS.map((facet) => (
          <Polygon
            key={facet.id}
            points={facet.points}
            fill={collected ? `url(#${facet.id})` : `${theme.textPrimary}26`}
          />
        ))}

        {collected && <Polygon points={SHEEN_POINTS} fill="url(#amberSheen)" />}
      </Svg>

      <GemSparkle width={size} left={0.18} top={0.08} box={0.18788} delay={0}   gradientId="amberSparkle1" dim={!collected} />
      <GemSparkle width={size} left={0.62} top={0.54} box={0.13939} delay={900} gradientId="amberSparkle2" dim={!collected} />
    </View>
  );
}

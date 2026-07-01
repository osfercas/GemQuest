import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine, pctPolygon } from './gemGradientMath';

// Lienzo de diseño original: 300x285 (más ancho que alto, al revés que Aquamarine).
// Los puntos del CSS están en % — como el box NO es cuadrado, hay que convertirlos a
// coordenadas reales del viewBox (a diferencia de Amber/Emerald, que sí son cuadrados
// y por eso pudieron usar directamente un viewBox 0-100).
const W = 300;
const H = 285;
const pts = (pairs: Array<[number, number]>) => pctPolygon(W, H, pairs);

// Corona + pabellón: facetas de color plano, igual que el CSS.
const FACETS = [
  { points: pts([[28, 22], [43, 22], [34, 46], [6, 46]]),  color: '#dbf1ff' }, // crown-l
  { points: pts([[72, 22], [57, 22], [66, 46], [94, 46]]), color: '#d2e9f9' }, // crown-r
  { points: pts([[6, 46], [34, 46], [50, 95]]),            color: '#bcdcf2' }, // pav-l
  { points: pts([[34, 46], [66, 46], [50, 95]]),           color: '#c3e0f4' }, // pav-c
  { points: pts([[66, 46], [94, 46], [50, 95]]),           color: '#b0d4ee' }, // pav-r
];

// La table comparte lienzo (inset:0) con el resto de facetas, así que su gradiente
// se calcula relativo a la caja completa 300x285, no a su propio bounding box.
const TABLE_POINTS = pts([[43, 22], [57, 22], [66, 46], [34, 46]]);

interface Props {
  size: number;
  collected?: boolean;
}

export function DiamondGem({ size, collected = true }: Readonly<Props>) {
  const { theme } = useTheme();
  // Contrato compartido con GemVisual: `size` es siempre el ALTO renderizado de la
  // gema; el ancho se deriva de la relación de aspecto propia del diseño (W > H aquí).
  const renderHeight = size;
  const renderWidth = size * (W / H);
  const scaleFactor = size / H;
  const dimColor = `${theme.textPrimary}26`;

  return (
    <View
      style={{
        width: renderWidth,
        height: renderHeight,
        shadowColor: '#468CBE',
        shadowOffset: { width: 12 * scaleFactor, height: 16 * scaleFactor },
        shadowOpacity: collected ? 0.3 : 0,
        shadowRadius: 10 * scaleFactor,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={renderWidth} height={renderHeight} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="diamondTable" gradientUnits="userSpaceOnUse" {...angleGradientLine(160, W, H)}>
            <Stop offset="0"    stopColor="#f6fbff" />
            <Stop offset="0.55" stopColor="#e6f4ff" />
            <Stop offset="1"    stopColor="#d3ebfb" />
          </LinearGradient>
        </Defs>

        {FACETS.map((facet) => (
          <Polygon
            key={facet.points}
            points={facet.points}
            fill={collected ? facet.color : dimColor}
          />
        ))}

        <Polygon points={TABLE_POINTS} fill={collected ? 'url(#diamondTable)' : dimColor} />
      </Svg>

      <GemSparkle width={renderWidth} height={renderHeight} left={0.16} top={0.09} box={66 / W} delay={0}   gradientId="diamondSparkle1" dim={!collected} />
      <GemSparkle width={renderWidth} height={renderHeight} left={0.6}  top={0.46} box={48 / W} delay={900} gradientId="diamondSparkle2" dim={!collected} />
    </View>
  );
}

import { View } from 'react-native';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine, conicWedgePoints } from './gemGradientMath';

// Lienzo de diseño original: 300x348. La silueta es un `path()` (no un polígono), igual
// que en el CSS, así que se reutiliza tal cual como <Path> + <ClipPath>.
const W = 300;
const H = 348;
const CENTER_X = W / 2;
const CENTER_Y = H / 2;
const TEARDROP_PATH =
  'M150,12 C235,70 285,150 285,215 C285,290 220,336 150,336 C80,336 15,290 15,215 C15,150 65,70 150,12 Z';

// conic-gradient(from -90deg at 50% 58%, ...): centro fuera de (150,174), 8 paradas duras de 45deg.
const WEDGE_CENTER_Y = H * 0.58;
const WEDGES = [
  { start: 270, end: 315, color: '#0a8ba3' },
  { start: 315, end: 360, color: '#22b4cc' },
  { start: 0,   end: 45,  color: '#8fe4ef' },
  { start: 45,  end: 90,  color: '#0a8ba3' },
  { start: 90,  end: 135, color: '#077387' },
  { start: 135, end: 180, color: '#22b4cc' },
  { start: 180, end: 225, color: '#5fd0e0' },
  { start: 225, end: 270, color: '#b8f0f6' },
];

// El CSS aplica `transform: scale()` DESPUÉS del recorte (clip-path), es decir escala
// el resultado ya recortado alrededor del centro de la caja — de ahí el grupo exterior.
function scaleAroundCenter(scale: number) {
  return `translate(${CENTER_X},${CENTER_Y}) scale(${scale}) translate(${-CENTER_X},${-CENTER_Y})`;
}

interface Props {
  size: number;
  collected?: boolean;
}

export function AquamarineGem({ size, collected = true }: Readonly<Props>) {
  const { theme } = useTheme();
  // `size` es la dimensión mayor (H > W en el diseño original), así que la gema
  // siempre cabe dentro de una caja size×size sin desbordar, igual que el resto de gemas.
  const renderHeight = size;
  const renderWidth = size * (W / H);
  const scaleFactor = size / H;
  const dimColor = `${theme.textPrimary}26`;

  return (
    <View
      style={{
        width: renderWidth,
        height: renderHeight,
        shadowColor: '#286E78',
        shadowOffset: { width: 12 * scaleFactor, height: 16 * scaleFactor },
        shadowOpacity: collected ? 0.3 : 0,
        shadowRadius: 12 * scaleFactor,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={renderWidth} height={renderHeight} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <ClipPath id="aquaClip">
            <Path d={TEARDROP_PATH} />
          </ClipPath>
          <LinearGradient id="aquaTable" gradientUnits="userSpaceOnUse" {...angleGradientLine(150, W, H)}>
            <Stop offset="0"    stopColor="#bff0f6" />
            <Stop offset="0.42" stopColor="#5fd0e0" />
            <Stop offset="0.74" stopColor="#1aa6bf" />
            <Stop offset="1"    stopColor="#0a8ba3" />
          </LinearGradient>
        </Defs>

        {/* body: 8 cuñas radiales recortadas por la silueta, luego escaladas al 95.5% */}
        <G transform={scaleAroundCenter(0.955)}>
          <G clipPath="url(#aquaClip)">
            {collected ? (
              WEDGES.map((w) => (
                <Polygon
                  key={`${w.start}-${w.end}`}
                  points={conicWedgePoints(CENTER_X, WEDGE_CENTER_Y, w.start, w.end)}
                  fill={w.color}
                />
              ))
            ) : (
              <Rect x={0} y={0} width={W} height={H} fill={dimColor} />
            )}
          </G>
        </G>

        {/* table: cara plana central, escalada al 62% */}
        <G transform={scaleAroundCenter(0.62)}>
          <G clipPath="url(#aquaClip)">
            <Rect x={0} y={0} width={W} height={H} fill={collected ? 'url(#aquaTable)' : dimColor} />
          </G>
        </G>
      </Svg>

      <GemSparkle width={renderWidth} height={renderHeight} left={0.22} top={0.3} box={58 / W}  delay={0}   gradientId="aquaSparkle1" dim={!collected} />
      <GemSparkle width={renderWidth} height={renderHeight} left={0.56} top={0.52} box={44 / W}  delay={900} gradientId="aquaSparkle2" dim={!collected} />
    </View>
  );
}

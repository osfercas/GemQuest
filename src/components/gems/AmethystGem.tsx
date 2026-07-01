import { View } from 'react-native';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GemSparkle } from './GemSparkle';
import { angleGradientLine, conicWedgePoints } from './gemGradientMath';

// Lienzo de diseño original: 320x372. La silueta (body) y la tabla son cada una un
// `path()` propio (a diferencia de Aquamarine, aquí no hay transform:scale de por medio).
const W = 320;
const H = 372;
const CENTER_X = W / 2;
const CENTER_Y = H / 2;

const BODY_PATH =
  'M160,24 C177.3,24 293,80.9 293,182 C293,283.1 177.3,340 160,340 C142.7,340 27,283.1 27,182 C27,80.9 142.7,24 160,24 Z';
const TABLE_PATH =
  'M160,82 C170.9,82 244,118 244,182 C244,246 170.9,282 160,282 C149.1,282 76,246 76,182 C76,118 149.1,82 160,82 Z';

// Paleta original más apagada, sustituida por un morado más vivo/saturado anclado al
// acento actual de la app (GEM_COLORS.Amethyst: dark #6B10CC, color #C77DFF, light #E0AAFF),
// conservando el mismo orden de claridad entre facetas del diseño original.
const VIVID = {
  darkest:   '#3D1166', // reemplaza #4a3260
  dark:      '#6B10CC', // reemplaza #6a4a86 — brand "dark"
  midDark:   '#7C2FCC', // reemplaza #7a5896
  mid:       '#9147E8', // reemplaza #8a68a6
  midLight:  '#A85EF5', // reemplaza #a488bd
  brand:     '#C77DFF', // reemplaza #b499cd — brand "color"
  light:     '#D699FF', // reemplaza #c3aed6
  brandLight:'#E0AAFF', // reemplaza #d8c8e6 — brand "light"
  lightest:  '#F0D9FF', // reemplaza #ddccec
};

// conic-gradient(from -90deg at 50% 50%, ...): centro real de la caja, 8 paradas duras de 45deg.
const WEDGES = [
  { start: 270, end: 315, color: VIVID.dark },
  { start: 315, end: 360, color: VIVID.mid },
  { start: 0,   end: 45,  color: VIVID.light },
  { start: 45,  end: 90,  color: VIVID.dark },
  { start: 90,  end: 135, color: VIVID.darkest },
  { start: 135, end: 180, color: VIVID.midDark },
  { start: 180, end: 225, color: VIVID.midLight },
  { start: 225, end: 270, color: VIVID.brandLight },
];

interface Props {
  size: number;
  collected?: boolean;
}

export function AmethystGem({ size, collected = true }: Readonly<Props>) {
  const { theme } = useTheme();
  // Contrato compartido con GemVisual: `size` es siempre el ALTO renderizado de la
  // gema; el ancho se deriva de la relación de aspecto propia del diseño (H > W aquí).
  const renderHeight = size;
  const renderWidth = size * (W / H);
  const scaleFactor = size / H;
  const dimColor = `${theme.textPrimary}26`;

  return (
    <View
      style={{
        width: renderWidth,
        height: renderHeight,
        shadowColor: '#5A3C78',
        shadowOffset: { width: 12 * scaleFactor, height: 16 * scaleFactor },
        shadowOpacity: collected ? 0.3 : 0,
        shadowRadius: 12 * scaleFactor,
        elevation: collected ? 6 : 0,
      }}
    >
      <Svg width={renderWidth} height={renderHeight} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <ClipPath id="amethystBodyClip">
            <Path d={BODY_PATH} />
          </ClipPath>
          <ClipPath id="amethystTableClip">
            <Path d={TABLE_PATH} />
          </ClipPath>
          <LinearGradient id="amethystTable" gradientUnits="userSpaceOnUse" {...angleGradientLine(150, W, H)}>
            <Stop offset="0"    stopColor={VIVID.lightest} />
            <Stop offset="0.42" stopColor={VIVID.brand} />
            <Stop offset="0.74" stopColor={VIVID.mid} />
            <Stop offset="1"    stopColor={VIVID.dark} />
          </LinearGradient>
        </Defs>

        <G clipPath="url(#amethystBodyClip)">
          {collected ? (
            WEDGES.map((w) => (
              <Polygon
                key={`${w.start}-${w.end}`}
                points={conicWedgePoints(CENTER_X, CENTER_Y, w.start, w.end)}
                fill={w.color}
              />
            ))
          ) : (
            <Rect x={0} y={0} width={W} height={H} fill={dimColor} />
          )}
        </G>

        <G clipPath="url(#amethystTableClip)">
          <Rect x={0} y={0} width={W} height={H} fill={collected ? 'url(#amethystTable)' : dimColor} />
        </G>
      </Svg>

      <GemSparkle width={renderWidth} height={renderHeight} left={0.14} top={0.14} box={60 / W} delay={0}   gradientId="amethystSparkle1" dim={!collected} />
      <GemSparkle width={renderWidth} height={renderHeight} left={0.6}  top={0.58} box={46 / W} delay={900} gradientId="amethystSparkle2" dim={!collected} />
    </View>
  );
}

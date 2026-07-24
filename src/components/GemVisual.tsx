import { ComponentType } from 'react';
import { View } from 'react-native';
import { GemShape, DragonBallShape, GEM_COLORS, GemName, getDragonBallStars } from './GemShape';
import { RubyGem } from './gems/RubyGem';
import { AmberGem } from './gems/AmberGem';
import { AquamarineGem } from './gems/AquamarineGem';
import { EmeraldGem } from './gems/EmeraldGem';
import { DiamondGem } from './gems/DiamondGem';
import { AmethystGem } from './gems/AmethystGem';
import { SapphireGem } from './gems/SapphireGem';
import { useTheme } from '../theme/ThemeContext';

const GEM_SHAPES: Partial<Record<GemName, ComponentType<{ size: number; collected?: boolean; dimColor?: string }>>> = {
  Ruby: RubyGem,
  Amber: AmberGem,
  Aquamarine: AquamarineGem,
  Emerald: EmeraldGem,
  Diamond: DiamondGem,
  Amethyst: AmethystGem,
  Sapphire: SapphireGem,
};

// Relación ancho/alto nativa de cada forma (para las que no son 1:1). En cada
// componente `size` representa siempre el ALTO renderizado; el ancho se deriva de esta
// relación (puede ser >1 o <1 según el diseño original sea más ancho o más alto que alto).
const GEM_ASPECT: Partial<Record<GemName, number>> = {
  Aquamarine: 300 / 348,
  Diamond: 300 / 285,
  Amethyst: 320 / 372,
};

// Margen uniforme (en la misma unidad que `size`) alrededor de la gema, para que
// nunca toque el borde de su caja.
const GEM_PADDING_RATIO = 0.06;

interface Props {
  name: GemName;
  size: number;
  collected?: boolean;
  dimColor?: string;
}

export function GemVisual({ name, size, collected = true, dimColor }: Readonly<Props>) {
  const { theme } = useTheme();
  const g = GEM_COLORS[name];

  if (theme.id === 'animeMagico') {
    return (
      <View style={{ opacity: collected ? 1 : 0.25 }}>
        <DragonBallShape size={size} stars={getDragonBallStars(name)} />
      </View>
    );
  }

  const Shape = GEM_SHAPES[name];
  if (Shape) {
    const pad = size * GEM_PADDING_RATIO;
    const shapeSize = size - pad * 2;
    const shapeWidth = shapeSize * (GEM_ASPECT[name] ?? 1);

    return (
      <View style={{ width: shapeWidth + pad * 2, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Shape size={shapeSize} collected={collected} dimColor={dimColor} />
      </View>
    );
  }

  return (
    <GemShape
      color={collected ? g.color : `${theme.textPrimary}26`}
      light={collected ? g.light : `${theme.textPrimary}40`}
      dark={collected ? g.dark  : `${theme.textPrimary}14`}
      size={size}
    />
  );
}

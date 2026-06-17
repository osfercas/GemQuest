import { View } from 'react-native';
import { GemShape, DragonBallShape, GEM_COLORS, GemName } from './GemShape';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  name: GemName;
  size: number;
  collected?: boolean;
  stars?: number;
}

export function GemVisual({ name, size, collected = true, stars }: Readonly<Props>) {
  const { theme } = useTheme();
  const g = GEM_COLORS[name];

  if (theme.id === 'animeMagico') {
    return (
      <View style={{ opacity: collected ? 1 : 0.25 }}>
        <DragonBallShape size={size} stars={stars} />
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

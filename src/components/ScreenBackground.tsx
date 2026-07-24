import { ReactNode } from 'react';
import { View, ImageBackground, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function ScreenBackground({ style, children }: Readonly<Props>) {
  const { theme } = useTheme();

  if (theme.bgRootImage) {
    return (
      <ImageBackground source={theme.bgRootImage} resizeMode="cover" style={style}>
        <LinearGradient
          colors={theme.bgRootOverlay ?? ['transparent', 'transparent', 'transparent']}
          locations={theme.bgRootOverlayLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {children}
      </ImageBackground>
    );
  }

  return <View style={[{ backgroundColor: theme.bgRoot }, style]}>{children}</View>;
}

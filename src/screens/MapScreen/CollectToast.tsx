import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GEM_COLORS } from '../../components/GemShape';
import { GemVisual } from '../../components/GemVisual';
import { GemMarker } from './types';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';

interface Props {
  gem: GemMarker | null;
  onCollect: () => void;
  onDismiss: () => void;
}

export default function CollectToast({ gem, onCollect, onDismiss }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!gem) return;
    opacity.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [gem]);

  if (!gem) return null;

  const g = GEM_COLORS[gem.name];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />

      <Animated.View
        style={[s.wrapper, { opacity, transform: [{ translateY }], bottom: 130 + bottom }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={[s.toast, { borderColor: g.color }]}
          onPress={onCollect}
          activeOpacity={0.75}
        >
          <GemVisual name={gem.name} size={22} />
          <Text style={[s.text, { color: g.light }]}>Capturar '{gem.name}'</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.tooltipBg,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    letterSpacing: 1,
  },
})

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { GemMarker } from './types';

interface Props {
  gem: GemMarker | null;
  onCollect: () => void;
  onDismiss: () => void;
}

export default function CollectToast({ gem, onCollect, onDismiss }: Props) {
  const { bottom } = useSafeAreaInsets();
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
      {/* Backdrop — captura los taps fuera del toast */}
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />

      {/* Toast — encima del backdrop */}
      <Animated.View
        style={[s.wrapper, { opacity, transform: [{ translateY }], bottom: 130 + bottom }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={[s.toast, { borderColor: g.color }]}
          onPress={onCollect}
          activeOpacity={0.75}
        >
          <GemShape color={g.color} light={g.light} dark={g.dark} size={22} />
          <Text style={[s.text, { color: g.light }]}>Capturar '{gem.name}'</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
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
    backgroundColor: 'rgba(8,11,20,0.92)',
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
});

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { GemMarker } from './types';

interface Props {
  gem: GemMarker;
  isNear: boolean;
  onPress: (gem: GemMarker) => void;
}

const styles = StyleSheet.create({
  inner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function GemMarkerView({ gem, isNear, onPress }: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const g = GEM_COLORS[gem.name];

  useEffect(() => {
    if (isNear && !gem.collected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [isNear, gem.collected]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.85] });
  const glowScale   = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });

  const coordinate = { latitude: gem.latitude, longitude: gem.longitude };

  return (
    <>
      {/* Glow: marker propio, su view ES el círculo → anchor centra el círculo exactamente */}
      {isNear && !gem.collected && (
        <Marker
          coordinate={coordinate}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges
          zIndex={0}
          onPress={() => {}}
        >
          <Animated.View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: g.color,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            }}
          />
        </Marker>
      )}

      {/* Gem: marker propio, su view ES el inner → anchor centra la gema exactamente */}
      <Marker
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={!gem.collected}
        zIndex={1}
        onPress={() => !gem.collected && isNear && onPress(gem)}
      >
        <View style={styles.inner}>
          {gem.collected ? (
            <Feather name="check" size={16} color="rgba(232,221,181,0.4)" />
          ) : (
            <GemShape color={g.color} light={g.light} dark={g.dark} size={18} />
          )}
        </View>
      </Marker>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { GEM_COLORS, DRAGON_BALL_COLORS } from '../../components/GemShape';
import { GemVisual } from '../../components/GemVisual';
import { GemMarker } from './types';
import { useTheme } from '../../theme/ThemeContext';

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
  collectedMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(30,30,30,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function GemMarkerView({ gem, isNear, onPress }: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [tracksViews, setTracksViews] = useState(true);
  const { theme } = useTheme();
  const isAnime = theme.id === 'animeMagico';
  const g = GEM_COLORS[gem.name];
  const glowColor = isAnime ? DRAGON_BALL_COLORS.glow : g.color;

  useEffect(() => {
    const t = setTimeout(() => setTracksViews(false), 1200);
    return () => clearTimeout(t);
  }, [gem.collected]);

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
  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });

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
          onPress={() => { }}
        >
          <Animated.View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: glowColor,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            }}
          />
        </Marker>
      )}

      {/* Gem: marker propio, su view ES el inner → anchor centra la gema exactamente */}
      <Marker
        key={`${gem.id}-${gem.collected}`}
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={tracksViews}
        zIndex={1}
        onPress={() => !gem.collected && onPress(gem)}
      >
        {gem.collected ? (
          <View style={styles.collectedMarker}>
            <Feather name="star" size={14} color="#fff" />
          </View>
        ) : (
          <View style={styles.inner}>
            <GemVisual name={gem.name} size={28} />
          </View>
        )}
      </Marker>
    </>
  );
}

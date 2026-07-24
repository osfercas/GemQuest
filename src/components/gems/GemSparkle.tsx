import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Polygon, RadialGradient, Stop } from 'react-native-svg';

// clip-path: polygon(50% 0, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0 50%, 45% 45%)
// expresado como fracciones (0-1) de la caja del propio destello.
const SPARKLE_UNIT_POINTS: Array<[number, number]> = [
  [0.5, 0], [0.55, 0.45], [1, 0.5], [0.55, 0.55],
  [0.5, 1], [0.45, 0.55], [0, 0.5], [0.45, 0.45],
];

function sparklePoints(box: number) {
  return SPARKLE_UNIT_POINTS.map(([fx, fy]) => `${fx * box},${fy * box}`).join(' ');
}

interface GemSparkleProps {
  width: number;
  height?: number;
  left: number;
  top: number;
  box: number;
  delay: number;
  gradientId: string;
  dim: boolean;
}

export function GemSparkle({ width, height = width, left, top, box, delay, gradientId, dim }: Readonly<GemSparkleProps>) {
  const twinkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, { toValue: 1, duration: 1300, delay, useNativeDriver: true }),
        Animated.timing(twinkle, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, twinkle]);

  const opacity = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const scale   = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] });
  const sparkleSize = width * box;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: width * left,
        top: height * top,
        width: sparkleSize,
        height: sparkleSize,
        opacity: dim ? 0.3 : opacity,
        transform: [{ scale }],
      }}
    >
      <Svg width={sparkleSize} height={sparkleSize}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0"    stopColor="#fff" stopOpacity={1} />
            <Stop offset="0.12" stopColor="#fff" stopOpacity={1} />
            <Stop offset="0.6"  stopColor="#fff" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Polygon points={sparklePoints(sparkleSize)} fill={dim ? '#ffffff80' : `url(#${gradientId})`} />
      </Svg>
    </Animated.View>
  );
}

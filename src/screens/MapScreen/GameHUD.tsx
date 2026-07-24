import { useMemo, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GemName } from '../../components/GemShape';
import { GemVisual } from '../../components/GemVisual';
import { createHudStyles } from './styles';
import { GemMarker } from './types';
import { useTheme } from '../../theme/ThemeContext';

const GEM_NAMES: GemName[] = ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'];

interface Props {
  gameName: string;
  gems: GemMarker[];
  topInset: number;
  onBack: () => void;
}

export default function GameHUD({ gameName, gems, topInset, onBack }: Readonly<Props>) {
  const { theme } = useTheme();
  const s = useMemo(() => createHudStyles(theme), [theme]);
  const found = gems.filter(g => g.collected).length;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [barOpen, setBarOpen] = useState(false);
  const barAnim = useRef(new Animated.Value(0)).current;

  const toggleBar = () => {
    const next = !barOpen;
    setBarOpen(next);
    Animated.timing(barAnim, {
      toValue: next ? 1 : 0,
      duration: 240,
      useNativeDriver: false,
    }).start();
  };

  const maxHeight = barAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });
  const opacity = barAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <>
      <View
        style={[s.header, { paddingTop: topInset + 12 }]}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity style={s.backBtn} activeOpacity={0.75} onPress={onBack}>
          <Feather name="arrow-left" size={18} color={`${theme.textPrimary}B3`} />
        </TouchableOpacity>
        <Text style={s.gameName} numberOfLines={1}>{gameName}</Text>
        <TouchableOpacity style={s.counter} activeOpacity={0.7} onPress={toggleBar}>
          <Text style={s.counterNum}>{found}/7</Text>
          <Text style={s.counterLabel}>{theme.termGems.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          s.gemBar,
          { top: headerHeight, maxHeight, opacity, overflow: 'hidden' },
        ]}
      >
        {GEM_NAMES.map((name) => {
          const gem = gems.find(g => g.name === name);
          const collected = gem?.collected ?? false;
          return (
            <View key={name} style={s.gemSlot}>
              <GemVisual name={name} size={28} collected={collected} />
              {theme.numberedGems ? null : (
                <Text style={[s.gemSlotLabel, collected && s.gemSlotCollected]}>
                  {name.slice(0, 3).toUpperCase()}
                </Text>
              )}
            </View>
          );
        })}
      </Animated.View>
    </>
  );
}

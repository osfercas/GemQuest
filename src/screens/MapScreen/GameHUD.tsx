import { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS, GemName } from '../../components/GemShape';
import { hudStyles as s } from './styles';
import { GemMarker } from './types';

const GEM_NAMES: GemName[] = ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'];

interface Props {
  gameName: string;
  gems: GemMarker[];
  topInset: number;
  onBack: () => void;
}

export default function GameHUD({ gameName, gems, topInset, onBack }: Props) {
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
  const opacity   = barAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <>
      {/* Header */}
      <View
        style={[s.header, { paddingTop: topInset + 12 }]}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity style={s.backBtn} activeOpacity={0.75} onPress={onBack}>
          <Feather name="arrow-left" size={18} color="rgba(232,221,181,0.7)" />
        </TouchableOpacity>
        <Text style={s.gameName} numberOfLines={1}>{gameName}</Text>
        <TouchableOpacity style={s.counter} activeOpacity={0.7} onPress={toggleBar}>
          <Text style={s.counterNum}>{found}/7</Text>
          <Text style={s.counterLabel}>GEMAS</Text>
        </TouchableOpacity>
      </View>

      {/* Gem bar — desliza desde el header */}
      <Animated.View
        style={[
          s.gemBar,
          { top: headerHeight, maxHeight, opacity, overflow: 'hidden' },
        ]}
      >
        {GEM_NAMES.map(name => {
          const gem = gems.find(g => g.name === name);
          const collected = gem?.collected ?? false;
          const g = GEM_COLORS[name];
          return (
            <View key={name} style={s.gemSlot}>
              <GemShape
                color={collected ? g.color : 'rgba(232,221,181,0.15)'}
                light={collected ? g.light : 'rgba(232,221,181,0.25)'}
                dark={collected ? g.dark  : 'rgba(232,221,181,0.08)'}
                size={20}
              />
              <Text style={[s.gemSlotLabel, collected && s.gemSlotCollected]}>
                {name.slice(0, 3).toUpperCase()}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </>
  );
}

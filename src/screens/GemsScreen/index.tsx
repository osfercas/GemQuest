import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../navigation/MainStack';
import { GemVisual } from '../../components/GemVisual';
import { ScreenBackground } from '../../components/ScreenBackground';
import { GEM_NAMES } from '../MapScreen/utils';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';

type Props = NativeStackScreenProps<MainStackParamList, 'Gems'>;

export default function GemsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScreenBackground style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{theme.termGems}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}>
        {GEM_NAMES.map((name) => (
          <View key={name} style={s.card}>
            <GemVisual name={name} size={140} />
            {theme.id === 'mainQuest' && <Text style={s.cardName}>{name}</Text>}
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.borderSubtle,
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15,
    color: theme.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scroll: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 14,
  },
  card: {
    width: '80%',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    paddingVertical: 24,
  },
  cardName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
});

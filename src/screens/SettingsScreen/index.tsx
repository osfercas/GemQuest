import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../navigation/MainStack';
import { useTheme } from '../../theme/ThemeContext';
import { THEMES } from '../../theme';
import type { Theme } from '../../theme';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme, setTheme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Apariencia</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={s.sectionLabel}>TEMA</Text>

        {Object.values(THEMES).map(t => (
          <ThemeCard
            key={t.id}
            t={t}
            active={t.id === theme.id}
            onSelect={() => setTheme(t.id)}
            parentTheme={theme}
          />
        ))}

        <Text style={[s.sectionLabel, { marginTop: 10 }]}>{theme.termGems.toUpperCase()}</Text>

        <Pressable
          style={s.linkRow}
          onPress={() => navigation.navigate('Gems')}
          android_ripple={{ color: `${theme.accentPrimary}20` }}
        >
          <Text style={s.linkRowText}>Ver {theme.termGems.toLowerCase()}</Text>
          <Feather name="chevron-right" size={18} color={theme.textSecondary} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

interface ThemeCardProps {
  t: Theme;
  active: boolean;
  onSelect: () => void;
  parentTheme: Theme;
}

function ThemeCard({ t, active, onSelect, parentTheme }: ThemeCardProps) {
  const s = useMemo(() => createStyles(parentTheme), [parentTheme]);

  return (
    <Pressable
      style={[s.card, active && s.cardActive]}
      onPress={onSelect}
      android_ripple={{ color: `${t.accentPrimary}20` }}
    >
      {/* Color preview */}
      <View style={s.preview}>
        <View style={[s.previewSwatch, { backgroundColor: t.bgRoot }]}>
          <View style={[s.swatchDot, { backgroundColor: t.accentPrimary }]} />
          <View style={[s.swatchDot, { backgroundColor: t.accentSecondary }]} />
          <View style={[s.swatchDot, { backgroundColor: t.textPrimary, opacity: 0.6 }]} />
        </View>
        <LinearGradient
          colors={t.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.previewGradient}
        />
      </View>

      {/* Info */}
      <View style={s.cardBody}>
        <Text style={s.cardName}>{t.name}</Text>
        <View style={s.colorRow}>
          <ColorDot color={t.bgRoot} />
          <ColorDot color={t.accentPrimary} />
          <ColorDot color={t.accentSecondary} />
          <ColorDot color={t.textPrimary} />
        </View>
      </View>

      {/* Check */}
      {active && (
        <View style={[s.checkCircle, { backgroundColor: t.accentPrimary }]}>
          <Feather name="check" size={14} color={t.textOnAccent} />
        </View>
      )}
    </Pressable>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <View style={[dotStyles.dot, { backgroundColor: color, borderColor: `${color}40` }]} />
  );
}

const dotStyles = StyleSheet.create({
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
});

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bgRoot,
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
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 14,
  },
  sectionLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: theme.textTertiary,
    letterSpacing: 3,
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: theme.bgCard,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.borderSubtle,
    padding: 16,
  },
  cardActive: {
    borderColor: theme.accentPrimary,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  preview: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 0,
  },
  previewSwatch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  swatchDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewGradient: {
    height: 10,
  },
  cardBody: {
    flex: 1,
    gap: 8,
  },
  cardName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.bgCard,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.borderSubtle,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  linkRowText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
});

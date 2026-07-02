import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { GEM_COLORS } from '../../components/GemShape';
import { GemVisual } from '../../components/GemVisual';
import { GemMarker } from './types';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';

const GEM_ORDER = ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'];

interface Props {
  gem: GemMarker | null;
  distanceM: number | null;
  canCollect: boolean;
  repositioning: boolean;
  repositionDisabled: boolean;
  repositionsLeft: number;
  onCollect: () => void;
  onReposition: () => void;
  onDismiss: () => void;
}

export default function GemTooltip({ gem, distanceM, canCollect, repositioning, repositionDisabled, repositionsLeft, onCollect, onReposition, onDismiss }: Readonly<Props>) {
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
  }, [gem?.id]);

  if (!gem) return null;

  const g        = GEM_COLORS[gem.name];
  const distText = distanceM == null ? '—' : `${Math.round(distanceM)} m`;
  const gemIndex = GEM_ORDER.indexOf(gem.name) + 1;
  const accentColor = theme.numberedGems ? theme.accentPrimary : g.color;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />

      <Animated.View
        style={[s.wrapper, { opacity, transform: [{ translateY }], bottom: 130 + bottom }]}
        pointerEvents="box-none"
      >
        <View style={[s.card, { borderColor: accentColor }]}>
          <View style={s.header}>
            <GemVisual name={gem.name} size={theme.numberedGems ? 105 : 30} stars={theme.numberedGems ? gemIndex : undefined} />
            <Text style={[s.name, { color: accentColor }]}>
              {theme.numberedGems ? `${theme.termGem} ${gemIndex}` : gem.name}
            </Text>
            <View style={s.distanceBadge}>
              <Feather name="navigation" size={11} color={theme.textSecondary} />
              <Text style={s.distanceText}>{distText}</Text>
            </View>
          </View>

          <Text style={s.coords}>
            {gem.latitude.toFixed(5)}, {gem.longitude.toFixed(5)}
          </Text>

          <View style={s.buttons}>
            {canCollect ? (
              <TouchableOpacity
                style={[s.btnPrimary, { backgroundColor: accentColor }]}
                onPress={onCollect}
                activeOpacity={0.75}
              >
                <Text style={s.btnPrimaryText}>Capturar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.btnSecondary, repositionDisabled && s.btnDisabled]}
                onPress={onReposition}
                disabled={repositioning || repositionDisabled}
                activeOpacity={0.7}
              >
                {repositioning ? (
                  <ActivityIndicator size="small" color={theme.textPrimary} />
                ) : (
                  <>
                    <Feather name="refresh-cw" size={13} color={theme.textPrimary} />
                    <Text style={s.btnSecondaryText}>Reposicionar</Text>
                    <Text style={s.repositionsLeft}>{repositionsLeft}/3</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: `${theme.bgRoot}F0`,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15,
    letterSpacing: 1,
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  coords: {
    fontSize: 11,
    color: theme.textTertiary,
    fontFamily: 'Cinzel_700Bold',
    letterSpacing: 0.5,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${theme.textPrimary}33`,
    minWidth: 44,
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
  btnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnPrimaryText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: theme.bgRoot,
    letterSpacing: 1,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  repositionsLeft: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: theme.textSecondary,
    letterSpacing: 0.5,
    marginLeft: 2,
  },
})

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { GemMarker } from './types';

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

export default function GemTooltip({ gem, distanceM, canCollect, repositioning, repositionDisabled, repositionsLeft, onCollect, onReposition, onDismiss }: Props) {
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
  }, [gem?.id]);

  if (!gem) return null;

  const g        = GEM_COLORS[gem.name];
  const distText = distanceM != null ? `${Math.round(distanceM)} m` : '—';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />

      <Animated.View
        style={[s.wrapper, { opacity, transform: [{ translateY }], bottom: 130 + bottom }]}
        pointerEvents="box-none"
      >
        <View style={[s.card, { borderColor: g.color }]}>
          <View style={s.header}>
            <GemShape color={g.color} light={g.light} dark={g.dark} size={20} />
            <Text style={[s.name, { color: g.light }]}>{gem.name}</Text>
            <View style={s.distanceBadge}>
              <Feather name="navigation" size={11} color="rgba(232,221,181,0.5)" />
              <Text style={s.distanceText}>{distText}</Text>
            </View>
          </View>

          <Text style={s.coords}>
            {gem.latitude.toFixed(5)}, {gem.longitude.toFixed(5)}
          </Text>

          <View style={s.buttons}>
            {!canCollect && (
              <TouchableOpacity
                style={[s.btnSecondary, repositionDisabled && s.btnDisabled]}
                onPress={onReposition}
                disabled={repositioning || repositionDisabled}
                activeOpacity={0.7}
              >
                {repositioning ? (
                  <ActivityIndicator size="small" color="#E8DDB5" />
                ) : (
                  <>
                    <Feather name="refresh-cw" size={13} color="#E8DDB5" />
                    <Text style={s.btnSecondaryText}>Reposicionar</Text>
                    <Text style={s.repositionsLeft}>{repositionsLeft}/3</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {canCollect && (
              <TouchableOpacity
                style={[s.btnPrimary, { backgroundColor: g.color }]}
                onPress={onCollect}
                activeOpacity={0.75}
              >
                <Text style={s.btnPrimaryText}>Capturar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(8,11,20,0.94)',
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
    color: 'rgba(232,221,181,0.5)',
    letterSpacing: 0.5,
  },
  coords: {
    fontSize: 11,
    color: 'rgba(232,221,181,0.35)',
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
    borderColor: 'rgba(232,221,181,0.2)',
    minWidth: 44,
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: '#E8DDB5',
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
    color: '#0e1220',
    letterSpacing: 1,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  repositionsLeft: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: 'rgba(232,221,181,0.45)',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
});

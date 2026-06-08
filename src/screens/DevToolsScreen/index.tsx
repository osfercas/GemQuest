import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../App';
import { loadGames, loadGameState } from '../../storage/gameStorage';
import type { Game } from '../HomeScreen/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DevTools'>;

interface GameEntry {
  game: Game;
  stateGems: { total: number; collected: number } | null;
}

interface StorageEntry {
  key: string;
  value: string;
}

export default function DevToolsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<GameEntry[]>([]);
  const [storageEntries, setStorageEntries] = useState<StorageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const games = await loadGames();
    const loaded: GameEntry[] = await Promise.all(
      games.map(async game => {
        const state = await loadGameState(game.id);
        return {
          game,
          stateGems: state
            ? { total: state.gems.length, collected: state.gems.filter(g => g.collected).length }
            : null,
        };
      }),
    );
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet([...keys].sort());
    setEntries(loaded);
    setStorageEntries(pairs.map(([key, value]) => ({ key, value: value ?? '' })));
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar storage',
      '¿Borrar todos los datos de la app? Esto elimina todas las partidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar todo', style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await reload();
          },
        },
      ],
    );
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={20} color="rgba(232,221,181,0.7)" />
        </TouchableOpacity>
        <Text style={s.title}>DevTools</Text>
        <TouchableOpacity onPress={reload} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="refresh-cw" size={16} color="rgba(232,221,181,0.5)" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}>

          {/* Games */}
          <Text style={s.sectionLabel}>PARTIDAS · {entries.length}</Text>
          {entries.length === 0 && <Text style={s.empty}>Sin partidas guardadas</Text>}
          {entries.map(({ game, stateGems }) => (
            <View key={game.id} style={s.card}>
              <View style={s.cardRow}>
                <View style={[s.badge, game.status === 'finished' ? s.badgeFinished : s.badgeActive]}>
                  <Text style={s.badgeText}>{game.status === 'finished' ? 'finished' : 'active'}</Text>
                </View>
                <Text style={s.gameName} numberOfLines={1}>{game.name}</Text>
              </View>
              <Row label="id"       value={game.id} mono />
              <Row label="radio"    value={`${game.radius} km`} />
              <Row label="fecha"    value={game.date} />
              <Row label="progreso" value={`${game.gemsFound} / ${game.gemsTotal} gemas`} />
              {stateGems
                ? <Row label="state gems" value={`${stateGems.collected} recogidas de ${stateGems.total}`} />
                : <Row label="state" value="sin GameState guardado" dim />}
              <TouchableOpacity
                style={s.victoryBtn}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Victory', { gameId: game.id })}
              >
                <Text style={s.victoryBtnText}>→ Ver Victory</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* AsyncStorage keys acordeón */}
          <Text style={[s.sectionLabel, { marginTop: 24 }]}>ASYNCSTORAGE · {storageEntries.length} keys</Text>
          {storageEntries.length === 0 && <Text style={s.empty}>Vacío</Text>}
          {storageEntries.map(entry => (
            <AccordionEntry key={entry.key} entry={entry} />
          ))}

          {/* Clear button */}
          <TouchableOpacity style={s.clearBtn} activeOpacity={0.75} onPress={handleClearAll}>
            <Feather name="trash-2" size={15} color="#FF6B6B" />
            <Text style={s.clearText}>Limpiar todo el storage</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </View>
  );
}

function AccordionEntry({ entry }: { entry: StorageEntry }) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.spring(anim, {
      toValue: open ? 0 : 1,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
    setOpen(o => !o);
  };

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });

  let formatted = entry.value;
  try { formatted = JSON.stringify(JSON.parse(entry.value), null, 2); } catch {}

  return (
    <View style={s.accordion}>
      <TouchableOpacity style={s.accordionHeader} activeOpacity={0.75} onPress={toggle}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Feather name="chevron-right" size={14} color="rgba(255,215,0,0.5)" />
        </Animated.View>
        <Text style={s.accordionKey} numberOfLines={1}>{entry.key}</Text>
      </TouchableOpacity>
      {open && (
        <View style={s.accordionBody}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={s.accordionJson}>{formatted}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function Row({ label, value, mono = false, dim = false }: { label: string; value: string; mono?: boolean; dim?: boolean }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, mono && s.mono, dim && s.dim]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080B14' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(232,221,181,0.08)',
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#E8DDB5',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 16, paddingTop: 20, gap: 8 },
  sectionLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: 'rgba(232,221,181,0.35)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  empty: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: 'rgba(232,221,181,0.3)',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,221,181,0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 4,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeActive: { backgroundColor: 'rgba(255,215,0,0.15)' },
  badgeFinished: { backgroundColor: 'rgba(107,203,119,0.15)' },
  badgeText: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: 'rgba(232,221,181,0.6)' },
  gameName: { fontFamily: 'Cinzel_700Bold', fontSize: 13, color: '#E8DDB5', flex: 1 },
  row: { flexDirection: 'row', gap: 8 },
  rowLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: 'rgba(232,221,181,0.35)', width: 72 },
  rowValue: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: 'rgba(232,221,181,0.7)', flex: 1 },
  mono: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: 'rgba(255,215,0,0.5)' },
  dim: { color: 'rgba(232,221,181,0.3)' },
  accordion: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,221,181,0.1)',
    borderRadius: 10,
    marginBottom: 4,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  accordionKey: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,215,0,0.7)',
    flex: 1,
  },
  accordionBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(232,221,181,0.08)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
  },
  accordionJson: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: 'rgba(232,221,181,0.65)',
    lineHeight: 18,
  },
  victoryBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,215,0,0.3)',
    backgroundColor: 'rgba(255,215,0,0.07)',
  },
  victoryBtnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: 'rgba(255,215,0,0.7)',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
    backgroundColor: 'rgba(255,107,107,0.08)',
  },
  clearText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: '#FF6B6B',
    letterSpacing: 1,
  },
});

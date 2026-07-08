import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../navigation/MainStack';
import { useAuth } from '../../context/AuthContext';
import type { Game } from './types';
import { useGameStorage } from '../../storage/useGameStorage';
import { createRootStyles, createSectionStyles } from './styles';
import { useTheme } from '../../theme/ThemeContext';
import Header from './Header';
import HeroCard from './HeroCard';
import ActiveGameCard from './ActiveGameCard';
import FinishedGameRow from './FinishedGameRow';
import NewGameWizard from './NewGameWizard';
import DeleteConfirmSheet from './DeleteConfirmSheet';
import { ScreenBackground } from '../../components/ScreenBackground';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { loadGames, deleteGame } = useGameStorage();
  const s = useMemo(() => createRootStyles(), []);
  const ss = useMemo(() => createSectionStyles(theme), [theme]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Game | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadGames().then(setGames);
    }, []),
  );

  const activeGames   = games.filter(g => g.status === 'active');
  const finishedGames = games.filter(g => g.status === 'finished');

  return (
    <ScreenBackground style={[s.root, { paddingTop: insets.top }]}>
      <Header
        username={user?.displayName ?? 'A'}
        onDevTools={() => navigation.navigate('DevTools')}
        onSettings={() => navigation.navigate('Settings')}
        onProfile={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard onPress={() => setWizardOpen(true)} />

        {activeGames.length > 0 && (
          <View style={ss.container}>
            <View style={ss.header}>
              <View style={ss.dot} />
              <Text style={ss.title}>En Curso</Text>
              <Text style={ss.count}>{activeGames.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.cardRow}>
              {activeGames.map(game => (
                <ActiveGameCard
                  key={game.id}
                  game={game}
                  onResume={() => navigation.navigate('Map', { gameId: game.id })}
                  onDelete={() => setPendingDelete(game)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {finishedGames.length > 0 && (
          <View style={ss.container}>
            <View style={ss.header}>
              <Feather name="check-circle" size={13} color={theme.textTertiary} />
              <Text style={[ss.title, { marginLeft: 6 }]}>Historial</Text>
              <Text style={ss.count}>{finishedGames.length}</Text>
            </View>
            {finishedGames.map(game => <FinishedGameRow key={game.id} game={game} />)}
          </View>
        )}
      </ScrollView>

      <DeleteConfirmSheet
        gameName={pendingDelete?.name ?? null}
        onConfirm={async () => {
          if (pendingDelete) {
            await deleteGame(pendingDelete.id);
            setPendingDelete(null);
            loadGames().then(setGames);
          }
        }}
        onCancel={() => setPendingDelete(null)}
        bottomInset={insets.bottom}
      />

      <NewGameWizard
        visible={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onStart={(gameId) => {
          setWizardOpen(false);
          navigation.navigate('Map', { gameId });
        }}
        bottomInset={insets.bottom}
      />
    </ScreenBackground>
  );
}

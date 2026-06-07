import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../App';
import { MOCK_GAMES } from './types';
import { rootStyles as s, sectionStyles } from './styles';
import Header from './Header';
import HeroCard from './HeroCard';
import ActiveGameCard from './ActiveGameCard';
import FinishedGameRow from './FinishedGameRow';
import NewGameWizard from './NewGameWizard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [wizardOpen, setWizardOpen] = useState(false);

  const activeGames   = MOCK_GAMES.filter(g => g.status === 'active');
  const finishedGames = MOCK_GAMES.filter(g => g.status === 'finished');

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <Header />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 16 }]} showsVerticalScrollIndicator={false}>
        <HeroCard onPress={() => setWizardOpen(true)} />

        {activeGames.length > 0 && (
          <View style={sectionStyles.container}>
            <View style={sectionStyles.header}>
              <View style={sectionStyles.dot} />
              <Text style={sectionStyles.title}>En Curso</Text>
              <Text style={sectionStyles.count}>{activeGames.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sectionStyles.cardRow}>
              {activeGames.map(game => <ActiveGameCard key={game.id} game={game} />)}
            </ScrollView>
          </View>
        )}

        {finishedGames.length > 0 && (
          <View style={sectionStyles.container}>
            <View style={sectionStyles.header}>
              <Feather name="check-circle" size={13} color="rgba(232,221,181,0.4)" />
              <Text style={[sectionStyles.title, { marginLeft: 6 }]}>Historial</Text>
              <Text style={sectionStyles.count}>{finishedGames.length}</Text>
            </View>
            {finishedGames.map(game => <FinishedGameRow key={game.id} game={game} />)}
          </View>
        )}

      </ScrollView>

      <NewGameWizard
        visible={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onStart={(name, radius) => navigation.navigate('Map', { name, radius })}
        bottomInset={insets.bottom}
      />
    </View>
  );
}

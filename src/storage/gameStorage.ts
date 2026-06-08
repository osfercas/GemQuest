import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game } from '../screens/HomeScreen/types';
import type { GemMarker } from '../screens/MapScreen/types';

const GAMES_KEY = 'gq:games';

interface GameState {
  center: { latitude: number; longitude: number };
  gems: GemMarker[];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function loadGames(): Promise<Game[]> {
  const raw = await AsyncStorage.getItem(GAMES_KEY);
  return raw ? (JSON.parse(raw) as Game[]) : [];
}

export async function upsertGame(game: Game): Promise<void> {
  const games = await loadGames();
  const idx = games.findIndex(g => g.id === game.id);
  if (idx >= 0) games[idx] = game;
  else games.unshift(game);
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export async function loadGameState(id: string): Promise<GameState | null> {
  const raw = await AsyncStorage.getItem(`gq:state:${id}`);
  return raw ? (JSON.parse(raw) as GameState) : null;
}

export async function saveGameState(id: string, state: GameState): Promise<void> {
  await AsyncStorage.setItem(`gq:state:${id}`, JSON.stringify(state));
}

export async function deleteGame(id: string): Promise<void> {
  const games = await loadGames();
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games.filter(g => g.id !== id)));
  await AsyncStorage.removeItem(`gq:state:${id}`);
}

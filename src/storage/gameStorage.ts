import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game } from '../screens/HomeScreen/types';
import type { GemMarker } from '../screens/MapScreen/types';

interface GameState {
  center: { latitude: number; longitude: number };
  gems: GemMarker[];
  repositionCount?: number;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function gamesKey(uid: string) { return `gq:games:${uid}`; }
function stateKey(uid: string, id: string) { return `gq:state:${uid}:${id}`; }

export async function loadGames(uid: string): Promise<Game[]> {
  const raw = await AsyncStorage.getItem(gamesKey(uid));
  return raw ? (JSON.parse(raw) as Game[]) : [];
}

export async function upsertGame(uid: string, game: Game): Promise<void> {
  const games = await loadGames(uid);
  const idx = games.findIndex(g => g.id === game.id);
  if (idx >= 0) games[idx] = game;
  else games.unshift(game);
  await AsyncStorage.setItem(gamesKey(uid), JSON.stringify(games));
}

export async function loadGameState(uid: string, id: string): Promise<GameState | null> {
  const raw = await AsyncStorage.getItem(stateKey(uid, id));
  return raw ? (JSON.parse(raw) as GameState) : null;
}

export async function saveGameState(uid: string, id: string, state: GameState): Promise<void> {
  await AsyncStorage.setItem(stateKey(uid, id), JSON.stringify(state));
}

export async function deleteGame(uid: string, id: string): Promise<void> {
  const games = await loadGames(uid);
  await AsyncStorage.setItem(gamesKey(uid), JSON.stringify(games.filter(g => g.id !== id)));
  await AsyncStorage.removeItem(stateKey(uid, id));
}

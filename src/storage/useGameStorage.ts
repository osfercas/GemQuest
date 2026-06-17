import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Game } from '../screens/HomeScreen/types';
import type { GemMarker } from '../screens/MapScreen/types';
import {
  generateId,
  loadGames,
  upsertGame,
  loadGameState,
  saveGameState,
  deleteGame,
} from './gameStorage';

interface GameState {
  center: { latitude: number; longitude: number };
  gems: GemMarker[];
  repositionCount?: number;
}

export function useGameStorage() {
  const { user } = useAuth();
  const uid = user!.uid;

  return {
    generateId,
    loadGames:     useCallback(() => loadGames(uid), [uid]),
    upsertGame:    useCallback((game: Game) => upsertGame(uid, game), [uid]),
    loadGameState: useCallback((id: string) => loadGameState(uid, id), [uid]),
    saveGameState: useCallback((id: string, state: GameState) => saveGameState(uid, id, state), [uid]),
    deleteGame:    useCallback((id: string) => deleteGame(uid, id), [uid]),
  };
}

import { GemName } from '../../components/GemShape';

export type GameStatus = 'active' | 'finished';

export interface Game {
  id: string;
  name: string;
  status: GameStatus;
  gemsFound: number;
  gemsTotal: number;
  radius: number;
  date: string;
  gems: GemName[];
}

export const RADIUS_OPTIONS = [
  { label: '500 m', value: 0.5 },
  { label: '1 km',  value: 1   },
  { label: '2 km',  value: 2   },
  { label: '5 km',  value: 5   },
] as const;

export const WIZARD_STEPS = 2;


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

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    name: 'Bosque encantado',
    status: 'active',
    gemsFound: 3,
    gemsTotal: 5,
    radius: 1,
    date: '2026-06-04',
    gems: ['Ruby', 'Emerald', 'Sapphire', 'Amethyst', 'Amber'],
  },
  {
    id: '2',
    name: 'Puerto antiguo',
    status: 'active',
    gemsFound: 1,
    gemsTotal: 7,
    radius: 2,
    date: '2026-06-05',
    gems: ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'],
  },
  {
    id: '3',
    name: 'Ciudad vieja',
    status: 'finished',
    gemsFound: 4,
    gemsTotal: 4,
    radius: 0.5,
    date: '2026-05-28',
    gems: ['Ruby', 'Diamond', 'Amethyst', 'Aquamarine'],
  },
  {
    id: '4',
    name: 'Montaña sagrada',
    status: 'finished',
    gemsFound: 7,
    gemsTotal: 7,
    radius: 5,
    date: '2026-05-15',
    gems: ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'],
  },
];

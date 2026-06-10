import { GemName } from '../../components/GemShape';

export interface GemMarker {
  id: string;
  name: GemName;
  latitude: number;
  longitude: number;
  collected: boolean;
}

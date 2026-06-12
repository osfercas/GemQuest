import { GemName } from '../../components/GemShape';
import { GemMarker } from './types';

export const GEM_NAMES: GemName[] = ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'];

export const COLLECT_RADIUS_M = 20;
export const GLOW_RADIUS_M    = 20;

// Distancia en metros entre dos coordenadas (Haversine)
export function distanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Metros mínimos desde el centro para que las gemas no aparezcan justo encima del jugador
const MIN_DISTANCE_RATIO = 0.15;

function randomPointInCircle(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): { latitude: number; longitude: number } {
  const R = 6371;
  const r = radiusKm * (MIN_DISTANCE_RATIO + Math.random() * (1 - MIN_DISTANCE_RATIO));
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (r / R) * (180 / Math.PI);
  const dLng = dLat / Math.cos(centerLat * (Math.PI / 180));
  return {
    latitude:  centerLat + dLat  * Math.sin(angle),
    longitude: centerLng + dLng * Math.cos(angle),
  };
}

type Coord = { latitude: number; longitude: number };

// Una sola petición HTTP para snappear todos los candidatos al nodo walkable más cercano dentro de snapRadiusM
async function snapCandidatesToWalkable(
  candidates: Coord[],
  snapRadiusM: number,
): Promise<Array<Coord | null>> {
  const unions = candidates.map(c =>
    `way(around:${snapRadiusM},${c.latitude},${c.longitude})` +
      `["highway"~"^(footway|path|pedestrian|crossing|steps|corridor|residential|living_street|service|tertiary|unclassified)$"]` +
      `["access"!~"^(private|no)$"];` +
    `way(around:${snapRadiusM},${c.latitude},${c.longitude})` +
      `["leisure"~"^(park|garden|playground|recreation_ground|nature_reserve|common)$"]` +
      `["access"!~"^(private|no)$"];`
  ).join('');

  // >; expande las ways a sus nodos de geometría, que están garantizados sobre la vía física
  const query = `[out:json][timeout:20];(${unions});>;out qt;`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('overpass_error');
    const json = await res.json();
    const nodes: Coord[] = (json.elements as any[])
      .filter(el => el.type === 'node')
      .map(el => ({ latitude: el.lat as number, longitude: el.lon as number }));

    return candidates.map(c => {
      let best: Coord | null = null;
      let bestDist = snapRadiusM + 1;
      for (const n of nodes) {
        const d = distanceMeters(c.latitude, c.longitude, n.latitude, n.longitude);
        if (d < bestDist) { bestDist = d; best = n; }
      }
      return best;
    });
  } finally {
    clearTimeout(timer);
  }
}

function pickSpread(
  positions: Array<Coord>,
  count: number,
  minSpacingM: number,
): Array<Coord> {
  const shuffled = [...positions].sort(() => Math.random() - 0.5);
  const picked: Array<Coord> = [];
  for (const pos of shuffled) {
    if (picked.every(p => distanceMeters(p.latitude, p.longitude, pos.latitude, pos.longitude) >= minSpacingM)) {
      picked.push(pos);
      if (picked.length === count) break;
    }
  }
  return picked;
}

export async function generateGemsOSM(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): Promise<GemMarker[]> {
  const SNAP_RADIUS_M = 150;
  const minSpacingM = Math.max(50, (radiusKm * 1000) / 8);

  try {
    const candidates: Coord[] = Array.from({ length: GEM_NAMES.length * 3 }, () =>
      randomPointInCircle(centerLat, centerLng, radiusKm)
    );

    const snapped = await snapCandidatesToWalkable(candidates, SNAP_RADIUS_M);
    const valid = snapped.filter((s): s is Coord => s !== null);

    if (valid.length > 0) {
      for (const factor of [1, 0.8, 0.6, 0.4, 0.2]) {
        const spread = pickSpread(valid, GEM_NAMES.length, minSpacingM * factor);
        if (spread.length === GEM_NAMES.length) {
          return GEM_NAMES.map((name, i) => ({
            id: `gem-${i}`, name, ...spread[i], collected: false,
          }));
        }
      }
      const shuffled = [...valid].sort(() => Math.random() - 0.5);
      return GEM_NAMES.map((name, i) => ({
        id: `gem-${i}`, name, ...shuffled[i % shuffled.length], collected: false,
      }));
    }
  } catch {
    // sin red o Overpass caído
  }

  return generateGems(centerLat, centerLng, radiusKm);
}

export function generateGems(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): GemMarker[] {
  return GEM_NAMES.map((name, i) => ({
    id: `gem-${i}`,
    name,
    ...randomPointInCircle(centerLat, centerLng, radiusKm),
    collected: false,
  }));
}

export async function repositionGem(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): Promise<{ latitude: number; longitude: number }> {
  const SNAP_RADIUS_M = 150;
  try {
    const candidates = Array.from({ length: 5 }, () =>
      randomPointInCircle(centerLat, centerLng, radiusKm)
    );
    const snapped = await snapCandidatesToWalkable(candidates, SNAP_RADIUS_M);
    const valid = snapped.filter((s): s is Coord => s !== null);
    if (valid.length > 0) return valid[0];
  } catch {
    // sin red o Overpass caído
  }
  return randomPointInCircle(centerLat, centerLng, radiusKm);
}

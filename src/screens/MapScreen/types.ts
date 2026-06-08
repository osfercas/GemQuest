import { GemName } from '../../components/GemShape';

export interface GemMarker {
  id: string;
  name: GemName;
  latitude: number;
  longitude: number;
  collected: boolean;
}

// Metros mínimos desde el centro para que las gemas no aparezcan justo encima del jugador
const MIN_DISTANCE_RATIO = 0.15;

// Genera N puntos aleatorios dentro de un círculo de `radiusKm` km
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

export const GEM_NAMES: GemName[] = ['Ruby', 'Diamond', 'Emerald', 'Sapphire', 'Amethyst', 'Amber', 'Aquamarine'];

async function fetchWalkableNodes(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): Promise<Array<{ latitude: number; longitude: number }>> {
  const radiusM = Math.round(radiusKm * 1000);
  const minM    = Math.round(radiusM * MIN_DISTANCE_RATIO);

  // Tier 1: explicitly pedestrian infrastructure (always safe on foot)
  // Tier 2: parks and open leisure spaces (always public and walkable)
  // Tier 3: slow residential streets — only if foot access isn't denied
  // secondary/tertiary/unclassified/track excluded: car roads, no guaranteed footway
  const query =
    `[out:json][timeout:15];` +
    `(` +
    `way["highway"~"^(footway|path|pedestrian|crossing|steps|corridor)$"]` +
      `["access"!~"^(private|no)$"]` +
      `(around:${radiusM},${centerLat},${centerLng});` +
    `way["leisure"~"^(park|garden|playground|recreation_ground)$"]` +
      `["access"!~"^(private|no)$"]` +
      `(around:${radiusM},${centerLat},${centerLng});` +
    `way["highway"~"^(residential|living_street|service)$"]` +
      `["foot"!="no"]["access"!~"^(private|no)$"]` +
      `(around:${radiusM},${centerLat},${centerLng});` +
    `);>>;out skt qt;`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('overpass_error');
    const json = await res.json();
    return (json.elements as any[])
      .filter(el => el.type === 'node')
      .map(el => ({ latitude: el.lat as number, longitude: el.lon as number }))
      .filter(pos => {
        const d = distanceMeters(centerLat, centerLng, pos.latitude, pos.longitude);
        return d >= minM && d <= radiusM;
      });
  } finally {
    clearTimeout(timer);
  }
}

function pickSpread(
  positions: Array<{ latitude: number; longitude: number }>,
  count: number,
  minSpacingM: number,
): Array<{ latitude: number; longitude: number }> {
  const shuffled = [...positions].sort(() => Math.random() - 0.5);
  const picked: Array<{ latitude: number; longitude: number }> = [];
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
  const minSpacingM = Math.max(50, (radiusKm * 1000) / 8);
  try {
    const nodes = await fetchWalkableNodes(centerLat, centerLng, radiusKm);
    // Relax spacing progressively: 100% → 60% → 30% of ideal minimum
    for (const factor of [1, 0.6, 0.3]) {
      const spread = pickSpread(nodes, GEM_NAMES.length, minSpacingM * factor);
      if (spread.length === GEM_NAMES.length) {
        return GEM_NAMES.map((name, i) => ({
          id: `gem-${i}`, name, ...spread[i], collected: false,
        }));
      }
    }
  } catch {
    // fallback below
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

export const COLLECT_RADIUS_M = 20;
export const GLOW_RADIUS_M    = 20;

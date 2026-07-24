// Replica el cálculo de la "gradient line" de CSS `linear-gradient(<angle>deg, ...)`
// para una caja W x H, devolviendo coordenadas utilizables como
// gradientUnits="userSpaceOnUse" en react-native-svg. Necesario para las gemas cuyas
// facetas comparten un único gradiente de fondo (background: inset 0 + clip-path por faceta),
// en vez de un gradiente independiente por faceta.
export function angleGradientLine(angleDeg: number, width = 100, height = width) {
  const rad = (angleDeg * Math.PI) / 180;
  const ux = Math.sin(rad);
  const uy = -Math.cos(rad);
  const r = (width / 2) * Math.abs(ux) + (height / 2) * Math.abs(uy);
  const cx = width / 2;
  const cy = height / 2;

  return {
    x1: cx - ux * r,
    y1: cy - uy * r,
    x2: cx + ux * r,
    y2: cy + uy * r,
  };
}

// Convierte puntos de un `clip-path: polygon(x% y%, ...)` a coordenadas reales de una
// caja W x H. Necesario en cajas no cuadradas: un viewBox 0-100 sólo coincide con
// puntos-porcentaje si W === H (ver AmberGem/EmeraldGem); si no, hay que escalar cada
// eje por separado, igual que CSS resuelve los porcentajes contra ancho/alto del box.
export function pctPolygon(width: number, height: number, pairs: Array<[number, number]>) {
  return pairs.map(([x, y]) => `${(x * width) / 100},${(y * height) / 100}`).join(' ');
}

// Puntos de una cuña (wedge) de conic-gradient: un triángulo desde el centro hasta
// dos puntos muy lejanos en los ángulos de inicio/fin. Los bordes radiales de un
// conic-gradient son rectos, así que esto es exacto sin importar el radio, siempre que
// sea lo bastante grande para sobresalir del clip-path que recorta la forma final.
export function conicWedgePoints(cx: number, cy: number, angleStart: number, angleEnd: number, radius = 1000) {
  const toXY = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.sin(rad), y: cy - radius * Math.cos(rad) };
  };
  const p1 = toXY(angleStart);
  const p2 = toXY(angleEnd);
  return `${cx},${cy} ${p1.x},${p1.y} ${p2.x},${p2.y}`;
}

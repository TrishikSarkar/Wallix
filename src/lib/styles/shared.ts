export function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = a + 0x6d2b79f5 | 0;
    const t = Math.imul(a ^ a >>> 15, 1 | a);
    const t2 = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}

export function noise(x: number, seed: number): number {
  const ix = Math.floor(x);
  const fx = x - ix;
  const t = fx * fx * (3 - 2 * fx);
  const seedA = Math.sin(ix * 127.1 + seed * 0.01) * 43758.5453;
  const seedB = Math.sin((ix + 1) * 127.1 + seed * 0.01) * 43758.5453;
  const a = seedA - Math.floor(seedA);
  const b = seedB - Math.floor(seedB);
  return a + (b - a) * t;
}

export function fbm(x: number, seed: number, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise(x * freq, seed + i * 100);
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}

export function lerpColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

export function getColor(colors: readonly string[], t: number, inverted: boolean): string {
  const ct = inverted ? 1 - t : t;
  const idx = ct * (colors.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  if (i >= colors.length - 1) return colors[colors.length - 1];
  if (i < 0) return colors[0];
  return lerpColor(colors[i], colors[i + 1], f);
}

export function getBgColor(colors: readonly string[], inverted: boolean): string {
  return inverted ? colors[colors.length - 1] : colors[0];
}

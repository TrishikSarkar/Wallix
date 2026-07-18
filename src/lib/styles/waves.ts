import type { StyleDefinition, StyleParams } from './types';
import { mulberry32, fbm, getColor, getBgColor } from './shared';

function draw(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: readonly string[],
  seed: number,
  inverted: boolean,
  params?: StyleParams,
) {
  const rng = mulberry32(seed);
  const layers = params?.layers ?? 8 + (rng() * 5 | 0);
  const density = params?.density ?? 1;
  const spacing = params?.spacing ?? 1;
  const smoothness = params?.smoothness ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const centerX = w * (0.45 + rng() * 0.1);
  const baseY = h * (0.75 + rng() * 0.08);
  const steps = Math.round(120 * density);

  for (let i = layers; i >= 0; i--) {
    const t = i / layers;
    const spread = h * (0.8 + t * 1.8) * spacing;
    const peakH = h * (0.05 + t * 0.3) * smoothness;
    const skew = rng() * 0.2 - 0.1;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseY + peakH * 0.5);
    for (let s = 0; s <= steps; s++) {
      const st = s / steps;
      const x = st * w;
      const dist = (x - centerX) / spread;
      const bell = Math.exp(-dist * dist * 0.4);
      const asymmetry = 1 + skew * dist;
      const wave = bell * peakH * asymmetry;
      const micro = fbm((x / h) * 2 + i * 1.4, seed + 200, 3) * h * 0.008;
      const y = baseY - wave + micro;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = getColor(colors, 0.1 + (1 - t) * 0.8, inverted);
    ctx.fill();
  }
}

function randomize(): StyleParams {
  return {
    layers: 8 + Math.floor(Math.random() * 6),
    density: 0.8 + Math.random() * 0.6,
    spacing: 0.8 + Math.random() * 0.6,
    smoothness: 0.8 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { layers: 10, density: 1, spacing: 1, smoothness: 1 };
}

const waves: StyleDefinition = {
  id: 'waves',
  name: 'Waves',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default waves;

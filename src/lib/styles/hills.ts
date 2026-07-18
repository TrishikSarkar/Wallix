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
  const layers = params?.layers ?? 4 + (rng() * 3 | 0);
  const smoothness = params?.smoothness ?? 1;
  const amplitude = params?.amplitude ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const baseY = h * (0.4 + t * 0.45);
    const height = h * (0.08 + t * 0.15) * amplitude;

    ctx.beginPath();
    ctx.moveTo(-2, h + 2);
    for (let x = -2; x <= w + 2; x += 2) {
      const noise1 = Math.sin(x * 0.003 * smoothness + i * 2.1 + seed) * 0.5 + 0.5;
      const noise2 = Math.sin(x * 0.007 * smoothness + i * 3.7 + seed * 2) * 0.3 + 0.3;
      const noise3 = fbm(x * 0.004 + i * 50, seed + 400, 2) * 0.2;
      const combined = noise1 + noise2 + noise3;
      const hillY = baseY - combined * height;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(w + 2, h + 2);
    ctx.closePath();
    ctx.fillStyle = getColor(colors, t * 0.8 + 0.1, inverted);
    ctx.fill();
  }
}

function randomize(): StyleParams {
  return {
    layers: 4 + Math.floor(Math.random() * 4),
    smoothness: 0.6 + Math.random() * 0.8,
    amplitude: 0.6 + Math.random() * 0.8,
  };
}

function defaultParams(): StyleParams {
  return { layers: 5, smoothness: 1, amplitude: 1 };
}

const hills: StyleDefinition = {
  id: 'hills',
  name: 'Hills',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default hills;

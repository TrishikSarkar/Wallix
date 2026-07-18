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
  const layers = params?.layers ?? 6 + (rng() * 4 | 0);
  const amplitude = params?.amplitude ?? 1;
  const spacing = params?.spacing ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const baseY = h * (0.5 + t * 0.4);
    const curveAmp = h * (0.04 + t * 0.12) * amplitude;
    const freq = (0.5 + t * 1.5) / spacing;
    const phase = rng() * Math.PI * 2 + i * 1.5;

    ctx.beginPath();
    ctx.moveTo(-2, h + 2);
    for (let x = -2; x <= w + 2; x += 2) {
      const wind = fbm(x * 0.005, seed + i * 50, 2) * 50;
      const y = baseY
        + Math.sin((x + wind) * freq + phase) * curveAmp
        + fbm(x * 0.003 + i * 100, seed, 2) * curveAmp * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + 2, h + 2);
    ctx.closePath();
    ctx.fillStyle = getColor(colors, t * 0.7 + 0.15, inverted);
    ctx.fill();
  }
}

function randomize(): StyleParams {
  return {
    layers: 6 + Math.floor(Math.random() * 5),
    amplitude: 0.7 + Math.random() * 0.8,
    spacing: 0.7 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { layers: 8, amplitude: 1, spacing: 1 };
}

const dunes: StyleDefinition = {
  id: 'dunes',
  name: 'Dunes',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default dunes;

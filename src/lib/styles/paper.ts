import type { StyleDefinition, StyleParams } from './types';
import { mulberry32, fbm, getBgColor } from './shared';

function draw(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: readonly string[],
  seed: number,
  inverted: boolean,
  params?: StyleParams,
) {
  const rng = mulberry32(seed);
  const density = params?.density ?? 1;
  const grainAmount = params?.grainAmount ?? 1;

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  const bg = getBgColor(colors, inverted);
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);

  const freq = 0.08 / density;
  const grain = 30 * grainAmount;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const n = fbm(x * freq + y * 0.06, seed + 300, 3);
      const gv = (n - 0.5) * grain;
      data[idx] = Math.max(0, Math.min(255, r + gv));
      data[idx + 1] = Math.max(0, Math.min(255, g + gv));
      data[idx + 2] = Math.max(0, Math.min(255, b + gv));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function randomize(): StyleParams {
  return {
    density: 0.5 + Math.random() * 1.5,
    grainAmount: 0.5 + Math.random() * 1.5,
  };
}

function defaultParams(): StyleParams {
  return { density: 1, grainAmount: 1 };
}

const paper: StyleDefinition = {
  id: 'paper',
  name: 'Paper',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default paper;

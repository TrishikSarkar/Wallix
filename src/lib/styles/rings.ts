import type { StyleDefinition, StyleParams } from './types';
import { mulberry32, getColor, getBgColor } from './shared';

function draw(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: readonly string[],
  seed: number,
  inverted: boolean,
  params?: StyleParams,
) {
  const rng = mulberry32(seed);
  const ringCount = params?.ringCount ?? 14 + (rng() * 6 | 0);
  const offset = params?.offset ?? 0;
  const radiusMultiplier = params?.radiusMultiplier ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const maxR = Math.sqrt(w * w + h * h) * radiusMultiplier;
  const originX = w * (rng() * 0.2 + 0.4) + offset * (w / 960);
  const originY = h * (rng() * 0.3 + 1.2);

  for (let i = ringCount; i >= 0; i--) {
    const t = i / ringCount;
    const r = maxR * t;
    ctx.beginPath();
    ctx.arc(originX, originY, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = getColor(colors, 0.1 + (1 - t) * 0.8, inverted);
    ctx.fill();
  }
}

function randomize(): StyleParams {
  return {
    ringCount: 10 + Math.floor(Math.random() * 12),
    offset: Math.random() * 50 - 25,
    radiusMultiplier: 0.8 + Math.random() * 0.4,
  };
}

function defaultParams(): StyleParams {
  return { ringCount: 16, offset: 0, radiusMultiplier: 1 };
}

const rings: StyleDefinition = {
  id: 'rings',
  name: 'Rings',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default rings;

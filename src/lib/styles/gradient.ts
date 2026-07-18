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
  const angle = params?.angle ?? rng() * 360;
  const softness = params?.softness ?? 0.5 + rng() * 0.4;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const cx = w / 2;
  const cy = h / 2;
  const diagonal = Math.sqrt(w * w + h * h) / 2;

  const dx = cos * diagonal;
  const dy = sin * diagonal;

  const gradient = ctx.createLinearGradient(
    cx - dx, cy - dy,
    cx + dx, cy + dy,
  );

  const stops = colors.length;

  for (let i = 0; i < stops; i++) {
    const t = i / (stops - 1);
    gradient.addColorStop(t, colors[inverted ? stops - 1 - i : i]);
  }

  if (softness > 1) {
    ctx.save();
    ctx.globalAlpha = softness - 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function randomize(): StyleParams {
  return {
    angle: Math.floor(Math.random() * 360),
    softness: 0.5 + Math.random() * 0.8,
    blendAmount: 0,
  };
}

function defaultParams(): StyleParams {
  return { angle: 45, softness: 0.8, blendAmount: 0 };
}

const gradient: StyleDefinition = {
  id: 'gradient',
  name: 'Gradient',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default gradient;

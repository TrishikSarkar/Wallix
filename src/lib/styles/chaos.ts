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
  const curveCount = params?.curveCount ?? 20;
  const complexity = params?.complexity ?? 1;
  const amplitude = params?.amplitude ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < curveCount; i++) {
    const t = i / curveCount;
    ctx.beginPath();
    let x = w * rng();
    let y = h * (0.3 + rng() * 0.5);
    ctx.moveTo(x, y);
    const steps = Math.round(12 * complexity);
    for (let j = 0; j < steps; j++) {
      x += (rng() - 0.5) * w * 0.8 * amplitude;
      y += (rng() - 0.4) * h * 0.15 * amplitude;
      const cp1x = w * rng();
      const cp1y = h * (0.3 + rng() * 0.5);
      const cp2x = w * rng();
      const cp2y = h * (0.3 + rng() * 0.5);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }
    ctx.strokeStyle = getColor(colors, t, inverted);
    ctx.lineWidth = (1 + rng() * 2) * amplitude;
    ctx.stroke();
  }
}

function randomize(): StyleParams {
  return {
    curveCount: 15 + Math.floor(Math.random() * 15),
    complexity: 0.8 + Math.random() * 0.6,
    amplitude: 0.8 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { curveCount: 20, complexity: 1, amplitude: 1 };
}

const chaos: StyleDefinition = {
  id: 'chaos',
  name: 'Chaos',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default chaos;

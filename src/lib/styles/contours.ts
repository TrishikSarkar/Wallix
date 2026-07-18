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
  const lineCount = params?.lineCount ?? 15 + (rng() * 10 | 0);
  const curveStrength = params?.curveStrength ?? 1;
  const spacing = params?.spacing ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const baseSpacing = (h / lineCount) * spacing;
  const offsetX = rng() * 200;

  ctx.lineWidth = 1.5;

  for (let i = 0; i < lineCount; i++) {
    const t = i / lineCount;
    const baseY = (i + 0.5) * baseSpacing;

    ctx.beginPath();
    for (let x = -2; x <= w + 2; x += 3) {
      const noiseVal = fbm((x + offsetX) * 0.005 + i * 0.3, seed, 3);
      const y = baseY + noiseVal * h * 0.08 * curveStrength;
      if (x === -2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = getColor(colors, t * 0.7 + 0.15, inverted);
    ctx.stroke();
  }
}

function randomize(): StyleParams {
  return {
    lineCount: 15 + Math.floor(Math.random() * 15),
    curveStrength: 0.5 + Math.random() * 1.2,
    spacing: 0.7 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { lineCount: 20, curveStrength: 1, spacing: 1 };
}

const contours: StyleDefinition = {
  id: 'contours',
  name: 'Contours',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default contours;

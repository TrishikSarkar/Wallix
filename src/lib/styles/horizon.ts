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
  const bandCount = params?.bandCount ?? 8 + (rng() * 5 | 0);
  const horizonHeight = params?.horizonHeight ?? 0.4 + rng() * 0.15;
  const curveStrength = params?.curveStrength ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const horizonY = h * horizonHeight;

  for (let i = 0; i < bandCount; i++) {
    const t = i / bandCount;
    const bandY = horizonY + (i / bandCount) * (h - horizonY);
    const nextBandY = horizonY + ((i + 1) / bandCount) * (h - horizonY);

    ctx.beginPath();
    ctx.moveTo(-2, bandY);
    for (let x = -2; x <= w + 2; x += 3) {
      const noiseVal = fbm(x * 0.003 + i * 1.5, seed + 50, 3);
      const y = bandY + noiseVal * h * 0.02 * curveStrength;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + 2, nextBandY);
    ctx.lineTo(-2, nextBandY);
    ctx.closePath();
    ctx.fillStyle = getColor(colors, 0.2 + t * 0.6, inverted);
    ctx.fill();
  }
}

function randomize(): StyleParams {
  return {
    bandCount: 8 + Math.floor(Math.random() * 6),
    horizonHeight: 0.35 + Math.random() * 0.2,
    curveStrength: 0.5 + Math.random() * 1,
  };
}

function defaultParams(): StyleParams {
  return { bandCount: 10, horizonHeight: 0.45, curveStrength: 1 };
}

const horizon: StyleDefinition = {
  id: 'horizon',
  name: 'Horizon',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default horizon;

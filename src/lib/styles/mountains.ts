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
  const layers = params?.layers ?? 5 + (rng() * 3 | 0);
  const jaggedness = params?.jaggedness ?? 1;
  const fogAmount = params?.fogAmount ?? 0;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const baseY = h * (0.55 + t * 0.35);
    const peakCount = params?.peakCount ?? 2 + (rng() * 2 | 0);
    const offset = rng() * 50;
    const peaks: { cx: number; peakH: number; width: number }[] = [];
    for (let p = 0; p < peakCount; p++) {
      peaks.push({
        cx: w * (0.1 + rng() * 0.8),
        peakH: h * (0.1 + rng() * 0.15) * (1 - i * 0.08),
        width: h * (0.6 + rng() * 0.6),
      });
    }
    ctx.beginPath();
    ctx.moveTo(-2, h + 2);
    for (let x = -2; x <= w + 2; x += 2) {
      let y = baseY;
      for (const p of peaks) {
        const dist = Math.abs(x - p.cx);
        if (dist < p.width) {
          const rise = 1 - dist / p.width;
          const sharpness = (1.3 + rng() * 0.3) * jaggedness;
          const peakY = Math.pow(rise, sharpness) * p.peakH;
          y = Math.min(y, baseY - peakY);
        }
      }
      const micro = fbm((x / h) * 1.5 + i * 2.3 + offset, seed + 100, 3) * h * 0.008 * jaggedness;
      ctx.lineTo(x, y + micro);
    }
    ctx.lineTo(w + 2, h + 2);
    ctx.closePath();
    const alpha = 1 - fogAmount * (i / layers);
    const color = getColor(colors, t * 0.8 + 0.12, inverted);
    if (alpha < 1) {
      ctx.globalAlpha = alpha;
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function randomize(): StyleParams {
  return {
    layers: 5 + Math.floor(Math.random() * 4),
    peakCount: 2 + Math.floor(Math.random() * 3),
    jaggedness: 0.8 + Math.random() * 0.8,
    fogAmount: Math.random() * 0.3,
  };
}

function defaultParams(): StyleParams {
  return { layers: 6, peakCount: 3, jaggedness: 1, fogAmount: 0 };
}

const mountains: StyleDefinition = {
  id: 'mountains',
  name: 'Mountains',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default mountains;

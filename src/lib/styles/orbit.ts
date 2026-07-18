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
  const circleCount = params?.circleCount ?? 8 + (rng() * 4 | 0);
  const spacing = params?.spacing ?? 1;
  const orbitOffset = params?.orbitOffset ?? 0;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const cx = w * (0.4 + rng() * 0.2);
  const cy = h * (0.4 + rng() * 0.2);
  const maxR = Math.min(w, h) * 0.45 * spacing;

  for (let i = 0; i < circleCount; i++) {
    const t = i / circleCount;
    const r = maxR * t + orbitOffset;
    const rot = rng() * Math.PI * 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = getColor(colors, t * 0.8 + 0.1, inverted);
    ctx.lineWidth = 1.5 + t * 3 + rng() * 1;
    ctx.stroke();

    const dotAngle = rng() * Math.PI * 2;
    const dotR = r;
    const dotSize = 2 + t * 3;
    ctx.beginPath();
    ctx.arc(Math.cos(dotAngle) * dotR, Math.sin(dotAngle) * dotR, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = getColor(colors, t * 0.5 + 0.3, inverted);
    ctx.fill();

    for (let d = 0; d < Math.floor(2 + t * 4); d++) {
      const da = dotAngle + (d + 1) * (Math.PI * 2 / (3 + t * 4)) + rng() * 0.3;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * dotR, Math.sin(da) * dotR, dotSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = getColor(colors, t * 0.4 + 0.4, inverted);
      ctx.fill();
    }

    ctx.restore();
  }
}

function randomize(): StyleParams {
  return {
    circleCount: 8 + Math.floor(Math.random() * 5),
    spacing: 0.8 + Math.random() * 0.4,
    orbitOffset: Math.random() * 20,
  };
}

function defaultParams(): StyleParams {
  return { circleCount: 10, spacing: 1, orbitOffset: 0 };
}

const orbit: StyleDefinition = {
  id: 'orbit',
  name: 'Orbit',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default orbit;

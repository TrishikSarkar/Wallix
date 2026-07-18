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
  const bandCount = params?.bandCount ?? 3 + (rng() * 3 | 0);
  const glowIntensity = params?.glowIntensity ?? 1;
  const width_ = params?.width ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      let total = 0;

      for (let b = 0; b < bandCount; b++) {
        const bx = w * (0.1 + rng() * 0.8);
        const by = h * (0.1 + rng() * 0.5);
        const bw = w * (0.15 + rng() * 0.2) * width_;
        const bh = h * (0.3 + rng() * 0.3);

        const dx = (x - bx) / bw;
        const dy = (y - by) / bh;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
          const wave = Math.sin(y * 0.02 + x * 0.005 + seed + b * 2) * 0.3 + 0.7;
          const falloff = Math.exp(-dist * dist * 1.5) * wave * glowIntensity;
          const t = (b + 0.5) / bandCount;
          const color = getColor(colors, t, inverted);
          const cr = parseInt(color.slice(4, color.indexOf(',')));
          const cg = parseInt(color.slice(color.indexOf(',') + 1, color.lastIndexOf(',')));
          const cb = parseInt(color.slice(color.lastIndexOf(',') + 1, color.indexOf(')')));
          total += falloff;
          data[idx] = Math.min(255, data[idx] + cr * falloff);
          data[idx + 1] = Math.min(255, data[idx + 1] + cg * falloff);
          data[idx + 2] = Math.min(255, data[idx + 2] + cb * falloff);
        }
      }

      data[idx + 3] = Math.min(255, Math.round(total * 255));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function randomize(): StyleParams {
  return {
    bandCount: 3 + Math.floor(Math.random() * 4),
    glowIntensity: 0.6 + Math.random() * 0.8,
    width: 0.7 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { bandCount: 4, glowIntensity: 1, width: 1 };
}

const aurora: StyleDefinition = {
  id: 'aurora',
  name: 'Aurora',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default aurora;

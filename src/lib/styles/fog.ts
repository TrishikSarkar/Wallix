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
  const density = params?.density ?? 1;
  const blur = params?.blur ?? 1;
  const overlap = params?.overlap ?? 1;

  ctx.fillStyle = getBgColor(colors, inverted);
  ctx.fillRect(0, 0, w, h);

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  const bgColor = getBgColor(colors, inverted);
  const bgR = parseInt(bgColor.slice(1, 3), 16);
  const bgG = parseInt(bgColor.slice(3, 5), 16);
  const bgB = parseInt(bgColor.slice(5, 7), 16);

  const fogLayers = Math.round(3 * density);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      let totalAlpha = 0;
      let totalR = 0, totalG = 0, totalB = 0;

      for (let l = 0; l < fogLayers; l++) {
        const fx = w * rng();
        const fy = h * rng();
        const fw = w * (0.3 + rng() * 0.4);
        const fh = h * (0.2 + rng() * 0.3) * overlap;

        const dx = (x - fx) / (fw * blur);
        const dy = (y - fy) / (fh * blur);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
          const noiseVal = fbm(x * 0.003 + y * 0.002 + l * 50, seed, 2);
          const falloff = Math.exp(-dist * dist * 2) * (0.3 + noiseVal * 0.3);
          const t = (l + 0.5) / fogLayers;
          const color = getColor(colors, 0.3 + t * 0.4, inverted);
          const cr = parseInt(color.slice(4, color.indexOf(',')));
          const cg = parseInt(color.slice(color.indexOf(',') + 1, color.lastIndexOf(',')));
          const cb = parseInt(color.slice(color.lastIndexOf(',') + 1, color.indexOf(')')));

          totalR += cr * falloff;
          totalG += cg * falloff;
          totalB += cb * falloff;
          totalAlpha += falloff;
        }
      }

      totalAlpha = Math.min(1, totalAlpha);
      const invAlpha = 1 - totalAlpha;
      data[idx] = Math.round(bgR * invAlpha + totalR * 255 * 3);
      data[idx + 1] = Math.round(bgG * invAlpha + totalG * 255 * 3);
      data[idx + 2] = Math.round(bgB * invAlpha + totalB * 255 * 3);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function randomize(): StyleParams {
  return {
    density: 0.7 + Math.random() * 0.8,
    blur: 0.7 + Math.random() * 0.6,
    overlap: 0.7 + Math.random() * 0.6,
  };
}

function defaultParams(): StyleParams {
  return { density: 1, blur: 1, overlap: 1 };
}

const fog: StyleDefinition = {
  id: 'fog',
  name: 'Fog',
  draw,
  randomize,
  defaultParams,
  supportsDark: true,
  supportsLight: true,
};

export default fog;

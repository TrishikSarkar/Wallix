export type WallpaperMode = 'dark' | 'light';

export interface Resolution {
  label: string;
  width: number;
  height: number;
}

export const RESOLUTIONS: Resolution[] = [
  { label: '4K (3840 × 2160)', width: 3840, height: 2160 },
  { label: 'iPhone (1290 × 2796)', width: 1290, height: 2796 },
  { label: 'Full HD (1920 × 1080)', width: 1920, height: 1080 },
  { label: 'Square (1080 × 1080)', width: 1080, height: 1080 },
  { label: 'HD (1280 × 720)', width: 1280, height: 720 },
];

import { registry, type StyleParams } from './styles';

export function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  style: string,
  colors: readonly string[],
  seed: number,
  inverted: boolean,
  params?: StyleParams,
) {
  const styleDef = registry.get(style);
  if (styleDef) {
    styleDef.draw(ctx, w, h, colors, seed, inverted, params);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
  }
}

export function exportWallpaper(
  style: string,
  colors: readonly string[],
  seed: number,
  inverted: boolean,
  resolution: Resolution,
  filename: string,
  params?: StyleParams,
): Promise<void> {
  const log: string[] = [];
  const logLine = (msg: string) => {
    log.push(msg);
    console.log(`[exportWallpaper] ${msg}`);
  };

  logLine(`Requested resolution: ${resolution.width} × ${resolution.height}`);

  const canvas = document.createElement('canvas');
  canvas.width = resolution.width;
  canvas.height = resolution.height;

  logLine(`Canvas created — width: ${canvas.width}, height: ${canvas.height}`);

  if (canvas.width !== resolution.width || canvas.height !== resolution.height) {
    const err = `Canvas dimensions mismatch: expected ${resolution.width}×${resolution.height}, got ${canvas.width}×${canvas.height}`;
    logLine(`ERROR: ${err}`);
    return Promise.reject(new Error(err));
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return Promise.reject(new Error('Could not get canvas context'));
  }

  drawPattern(ctx, resolution.width, resolution.height, style, colors, seed, inverted, params);

  logLine(`Canvas after draw — width: ${canvas.width}, height: ${canvas.height}`);

  canvas.style.position = 'absolute';
  canvas.style.left = '-9999px';
  canvas.style.top = '-9999px';
  document.body.appendChild(canvas);
  logLine('Canvas appended to DOM for export');

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        document.body.removeChild(canvas);
        reject(new Error('Could not create blob'));
        return;
      }

      logLine(`Blob created (toBlob) — size: ${blob.size} bytes, type: ${blob.type}`);

      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        logLine(`Blob Image onload — naturalWidth: ${img.naturalWidth}, naturalHeight: ${img.naturalHeight}`);
        (window as unknown as Record<string, unknown>).__exportLog = log;

        if (img.naturalWidth === resolution.width && img.naturalHeight === resolution.height) {
          logLine(`Exported image dimensions VERIFIED: ${img.naturalWidth} × ${img.naturalHeight}`);
          document.body.removeChild(canvas);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          resolve();
          return;
        }

        logLine(`toBlob dimensions WRONG — falling back to toDataURL`);
        URL.revokeObjectURL(url);

        const dataURL = canvas.toDataURL('image/png');
        logLine(`toDataURL fallback — dataURL length: ${dataURL.length}`);
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)![1];
        const raw = atob(parts[1]);
        const len = raw.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          arr[i] = raw.charCodeAt(i);
        }
        const blob2 = new Blob([arr], { type: mime });
        logLine(`toDataURL fallback — blob size: ${blob2.size}`);

        const url2 = URL.createObjectURL(blob2);
        const img2 = new Image();
        img2.onload = () => {
          logLine(`toDataURL fallback Image onload — naturalWidth: ${img2.naturalWidth}, naturalHeight: ${img2.naturalHeight}`);
          document.body.removeChild(canvas);

          if (img2.naturalWidth === resolution.width && img2.naturalHeight === resolution.height) {
            logLine(`toDataURL fallback dimensions VERIFIED: ${img2.naturalWidth} × ${img2.naturalHeight}`);
            const a = document.createElement('a');
            a.href = url2;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url2), 1000);
            resolve();
          } else {
            URL.revokeObjectURL(url2);
            reject(new Error(
              `Export failed: toBlob gave ${img.naturalWidth}×${img.naturalHeight}, ` +
              `toDataURL gave ${img2.naturalWidth}×${img2.naturalHeight}. ` +
              `Expected ${resolution.width}×${resolution.height}`
            ));
          }
        };
        img2.onerror = () => {
          document.body.removeChild(canvas);
          reject(new Error('Failed to load toDataURL fallback image'));
        };
        img2.src = url2;
      };
      img.onerror = () => {
        document.body.removeChild(canvas);
        reject(new Error('Failed to load exported image for verification'));
      };
      img.src = url;
    }, 'image/png');
  });
}

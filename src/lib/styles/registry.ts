import type { StyleDefinition, StyleParams } from './types';

class StyleRegistry {
  private styles = new Map<string, StyleDefinition>();

  register(style: StyleDefinition): void {
    if (this.styles.has(style.id)) {
      throw new Error(`Style "${style.id}" is already registered`);
    }
    this.styles.set(style.id, style);
  }

  get(id: string): StyleDefinition | undefined {
    return this.styles.get(id);
  }

  getAll(): StyleDefinition[] {
    return Array.from(this.styles.values());
  }

  draw(
    id: string,
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    colors: readonly string[],
    seed: number,
    inverted: boolean,
    params?: StyleParams,
  ): void {
    const style = this.styles.get(id);
    if (!style) {
      throw new Error(`Unknown style "${id}"`);
    }
    style.draw(ctx, w, h, colors, seed, inverted, params);
  }

  randomize(id: string): StyleParams {
    const style = this.styles.get(id);
    if (!style) {
      throw new Error(`Unknown style "${id}"`);
    }
    return style.randomize();
  }

  getVisibleStyles(): StyleDefinition[] {
    return this.getAll();
  }
}

export const registry = new StyleRegistry();

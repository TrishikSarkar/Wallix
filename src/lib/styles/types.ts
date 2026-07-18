export interface StyleParams {
  [key: string]: number;
}

export interface StyleDefinition {
  id: string;
  name: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    colors: readonly string[],
    seed: number,
    inverted: boolean,
    params?: StyleParams,
  ) => void;
  randomize: () => StyleParams;
  defaultParams: () => StyleParams;
  supportsDark: boolean;
  supportsLight: boolean;
}

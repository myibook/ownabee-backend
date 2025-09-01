export type CanvasTextItem = {
  order: number;
  id: string;
  originalTextId: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  baseFontSize: number;
  minFontSize: number;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  color?: string;
  backgroundColor?: string;
};

export type CanvasImageItem = {
  id: string;
  type: 'image';
  linkedTextId: string;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
};

export type CanvasItem = CanvasTextItem | CanvasImageItem;
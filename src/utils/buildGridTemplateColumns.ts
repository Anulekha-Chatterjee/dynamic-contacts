import type { LayoutColumn } from '../types/config';

/** Turn layout.json width (e.g. "44%") into a proportional fr weight. */
function widthToFrWeight(width: string): number {
  const trimmed = width.trim();
  const percentMatch = trimmed.match(/^([\d.]+)%$/);
  if (percentMatch) return parseFloat(percentMatch[1]);
  const frMatch = trimmed.match(/^([\d.]+)fr$/);
  if (frMatch) return parseFloat(frMatch[1]);
  return 1;
}

/** Build grid tracks from JSON column config; visible columns always fill 100% width. */
export function buildGridTemplateColumns(columns: LayoutColumn[]): string {
  return columns.map((c) => `${widthToFrWeight(c.width)}fr`).join(' ');
}

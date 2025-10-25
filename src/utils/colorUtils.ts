export const PALETTES = [
  ["#06b6d4", "#7c3aed", "#f472b6"],
  ["#22c55e", "#06b6d4", "#60a5fa"],
];

export const DEVICE_IS_MOBILE =
  typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

export function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

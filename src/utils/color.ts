export function hexColorToNumber(hex: string): number {
  return parseInt(`0x${hex.substring(1)}`, 16);
}

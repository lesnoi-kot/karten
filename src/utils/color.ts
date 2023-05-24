import { ENTITY_COLOR } from "models/constants";
import { ColorName } from "models/types";

export function hexColorToNumber(hex: string): number {
  return parseInt(`0x${hex.substring(1)}`, 16);
}

export function numberToHexColor(color: number): string {
  return "#" + color.toString(16).padStart(6, "0");
}

export function getColorName(
  hexColor: string,
  defaultColor: ColorName = "blue",
): ColorName {
  const entry = Object.entries(ENTITY_COLOR).find(
    ([name, value]) => value === hexColor,
  );
  return entry ? (entry[0] as ColorName) : defaultColor;
}

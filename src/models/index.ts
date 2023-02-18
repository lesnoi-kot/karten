import { ENTITY_COLOR } from "./constants";
import { ColorName } from "./types";

export function colorToNumber(color: ColorName): number {
  return parseInt(ENTITY_COLOR[color].slice(1), 16);
}

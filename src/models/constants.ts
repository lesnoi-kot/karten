export const ENTITY_COLOR = {
  blue: "#0079bf",
  orange: "#d29034",
  green: "#519839",
  red: "#b04632",
  purple: "#89609e",
  pink: "#cd5a91",
  lime: "#4bbf6b",
  sky: "#00aecc",
  black: "#000000",
} as const;

export const ENTITY_COLOR_NAMES: Array<keyof typeof ENTITY_COLOR> = Object.keys(
  ENTITY_COLOR,
) as any;

export const GUEST_USER_ID = 1;

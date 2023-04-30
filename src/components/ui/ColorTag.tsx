import { Box, BoxProps, SxProps, Theme } from "@mui/material";

import { ENTITY_COLOR, ENTITY_COLOR_NAMES } from "models/constants";
import { ColorName } from "models/types";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  color: ColorName;
  onClick(color: ColorName, hexColor: string): void;
};

const sxColorTile: SxProps<Theme> = {
  width: "40px",
  height: "32px",
  cursor: "pointer",
};

export function ColorTag({ color, onClick, ...props }: Props) {
  return (
    <Box
      title={color}
      bgcolor={ENTITY_COLOR[color]}
      sx={sxColorTile}
      {...props}
      onClick={() => {
        onClick(color, ENTITY_COLOR[color]);
      }}
    />
  );
}

export function ColorTags(props: Omit<Props, "color">) {
  return (
    <>
      {ENTITY_COLOR_NAMES.map((color: ColorName) => (
        <ColorTag key={color} color={color} {...props} />
      ))}
    </>
  );
}

export default ColorTag;

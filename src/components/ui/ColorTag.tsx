import { Box, BoxProps, SxProps, Theme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { ENTITY_COLOR, ENTITY_COLOR_NAMES } from "models/constants";
import { ColorName } from "models/types";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  color: ColorName;
  checked?: boolean;
  onClick(color: ColorName, hexColor: string): void;
};

const sxColorTile: SxProps<Theme> = {
  width: "40px",
  height: "32px",
  cursor: "pointer",
};

export function ColorTag({ color, onClick, checked, ...props }: Props) {
  return (
    <Box
      title={color}
      bgcolor={ENTITY_COLOR[color]}
      sx={sxColorTile}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
      onClick={() => {
        onClick(color, ENTITY_COLOR[color]);
      }}
    >
      {checked && <CheckIcon htmlColor="white" fontSize="small" />}
    </Box>
  );
}

type ColorTagsProps = { checkedColor: ColorName } & Omit<Props, "color">;

export function ColorTags({ checkedColor, ...props }: ColorTagsProps) {
  return (
    <>
      {ENTITY_COLOR_NAMES.map((color: ColorName) => (
        <ColorTag
          key={color}
          color={color}
          checked={checkedColor === color}
          {...props}
        />
      ))}
    </>
  );
}

export default ColorTag;

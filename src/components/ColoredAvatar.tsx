import { Avatar, AvatarProps, SxProps, Theme } from "@mui/material";
import { is } from "ramda";

import { ENTITY_COLOR, ENTITY_COLOR_NAMES } from "models/constants";

const computeColor = (text: string) => {
  const color =
    ENTITY_COLOR_NAMES[text.charCodeAt(0) % ENTITY_COLOR_NAMES.length];
  return ENTITY_COLOR[color];
};

export default function ColoredAvatar({ children, ...props }: AvatarProps) {
  const childrenIsString = is(String, children);

  const sx: SxProps<Theme> = {
    color: "white",
    bgcolor: childrenIsString ? computeColor(children) : undefined,
    ...props.sx,
  };

  return (
    <Avatar variant="circular" {...props} sx={sx}>
      {childrenIsString ? children.toUpperCase().at(0) : children}
    </Avatar>
  );
}

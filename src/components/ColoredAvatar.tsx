import { Avatar, AvatarProps, SxProps, Theme } from "@mui/material";
import { is } from "ramda";

import { ENTITY_COLOR, ENTITY_COLOR_NAMES } from "models/constants";

const computeColor = (text: string) => {
  const color =
    ENTITY_COLOR_NAMES[text.charCodeAt(0) % ENTITY_COLOR_NAMES.length];
  return ENTITY_COLOR[color];
};

type Props = AvatarProps & { oneLetter?: boolean };

export default function ColoredAvatar({
  oneLetter = false,
  children,
  ...props
}: Props) {
  const childrenIsString = is(String, children);

  const sx: SxProps<Theme> = {
    color: "white",
    bgcolor: childrenIsString ? computeColor(children) : undefined,
    ...props.sx,
  };

  return (
    <Avatar {...props} sx={sx}>
      {oneLetter && childrenIsString ? children.toUpperCase().at(0) : children}
    </Avatar>
  );
}

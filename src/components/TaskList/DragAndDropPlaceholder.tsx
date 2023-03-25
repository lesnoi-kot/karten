import { Box } from "@mui/material";

type Props = {
  rect: DOMRect;
};

export function DragAndDropPlaceholder({ rect }: Props) {
  return (
    <Box
      height={rect.height}
      width={rect.width}
      position="absolute"
      top="0"
      zIndex="10000"
      bgcolor="surfaces.100"
    />
  );
}

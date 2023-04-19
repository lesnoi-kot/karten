import { Box } from "@mui/material";

import boardPreviewSVG from "./board_preview.svg";

type Props = {
  color: string;
  coverURL?: string | null;
};

export default function BoardCoverPreview({ color, coverURL }: Props) {
  return (
    <Box
      display="flex"
      position="relative"
      width="200px"
      height="120px"
      paddingX={1}
      alignItems="center"
      justifyContent="center"
      margin="0 auto"
      bgcolor={color}
      title="New board preview"
      sx={{
        backgroundImage: coverURL ? `url("${coverURL}")` : undefined,
        backgroundSize: "cover",
      }}
    >
      <Box
        component="img"
        zIndex="1"
        width="100%"
        src={boardPreviewSVG}
        alt="Preview"
      />
    </Box>
  );
}

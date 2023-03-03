import React from "react";
import { Paper, PaperProps, SxProps, Theme } from "@mui/material";

type Props = {
  children: React.ReactNode;
  color?: string;
  coverURL?: string;
};

const sxCard: SxProps<Theme> = {
  position: "relative",
  width: "200px",
  height: "100px",
  padding: 1,
  "word-wrap": "break-word",
  color: "white",
  cursor: "pointer",
  boxShadow: "none",
  border: "none",
  backgroundSize: "cover",
};

export function PreviewCard({ children, color, coverURL }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        ...sxCard,
        bgcolor: color,
        backgroundImage: coverURL ? `url("${coverURL}")` : undefined,
      }} // TODO reallocation
    >
      {children}
    </Paper>
  );
}

export function PreviewCardIconButton(props: PaperProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        ...sxCard,
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
      {...props}
    />
  );
}

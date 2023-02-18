import React from "react";
import cx from "classnames";
import { Box, Paper, PaperProps } from "@mui/material";

import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  color?: string;
  coverURL?: string;
};

export function PreviewCard({ children, color, coverURL }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 1,
        position: "relative",
        bgcolor: color,
        backgroundImage: coverURL ? `url("${coverURL}")` : undefined,
        backgroundSize: "cover",
        color: "white",
        boxShadow: "none",
        border: "none",
      }} // TODO reallocation
      className={styles.card}
    >
      {children}
    </Paper>
  );
}

export function PreviewCardIconButton(props: PaperProps) {
  return (
    <Paper
      className={cx(styles.card, styles.cardButton)}
      variant="outlined"
      {...props}
    />
  );
}

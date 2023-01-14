import React from "react";
import { Box, BoxProps } from "@mui/material";

import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
};

export function PreviewCard({ children }: Props) {
  return (
    <Box className={styles.card} padding={1}>
      <Box className={styles.cardText}>{children}</Box>
    </Box>
  );
}

export function PreviewCardIconButton({ children, ...props }: BoxProps) {
  return (
    <Box className={styles.cardButton} padding={1} {...props}>
      {children}
    </Box>
  );
}

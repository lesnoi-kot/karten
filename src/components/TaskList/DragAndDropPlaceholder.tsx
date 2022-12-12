import React from "react";
import { Box } from "@mui/material";

import styles from "./styles.module.css";

type Props = {
  rect?: DOMRect;
};

export function DragAndDropPlaceholder({ rect }: Props) {
  if (!rect) {
    return null;
  }

  return (
    <Box
      height={rect.height}
      width={rect.width}
      className={styles.placeholder}
    ></Box>
  );
}

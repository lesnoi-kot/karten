import React, { useState } from "react";
import { Box } from "@mui/material";

import * as models from "models/types";

import { useTaskDND } from "./hooks";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  index: number;
  taskId: models.ID;
  taskListId: models.ID;
};

const ListSlot = ({ children, taskId, index }: Props) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const { isDragging, dragPreviewRef } = useTaskDND({
    taskId,
    taskRef: ref,
  });

  const box = isDragging ? ref?.getBoundingClientRect() : undefined;

  return (
    <Box ref={setRef} position="relative" paddingY={0.5} width="content">
      <Box ref={dragPreviewRef}>{children}</Box>
      {isDragging && box && (
        <Box
          height={box.height}
          width={box.width}
          className={styles.placeholder}
        ></Box>
      )}
    </Box>
  );
};

export default ListSlot;

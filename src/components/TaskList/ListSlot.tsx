import React, { useState } from "react";
import { Box } from "@mui/material";

import * as models from "models/types";

import { useTaskDND } from "./hooks/taskDragAndDrop";
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder";

type Props = {
  children: React.ReactNode;
  taskId: models.ID;
};

const ListSlot = ({ children, taskId }: Props) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const { isDragging, dragPreviewRef } = useTaskDND({
    taskId,
    taskRef: ref,
  });

  return (
    <Box ref={setRef} position="relative" px={1} width="content">
      <Box ref={dragPreviewRef}>{children}</Box>
      {isDragging && (
        <DragAndDropPlaceholder rect={ref?.getBoundingClientRect()} />
      )}
    </Box>
  );
};

export default ListSlot;

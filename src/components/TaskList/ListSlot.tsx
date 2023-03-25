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
  const [taskRef, setTaskRef] = useState<HTMLDivElement | null>(null);

  const { isDragging, dragPreviewRef, dragRef, dropRef } = useTaskDND({
    taskId,
    taskRef,
  });

  const rect: DOMRect | undefined = taskRef?.getBoundingClientRect();

  dragRef(dragPreviewRef(taskRef));

  return (
    <Box ref={dropRef} position="relative" px={1}>
      <Box ref={setTaskRef}>{children}</Box>
      {isDragging && rect && <DragAndDropPlaceholder rect={rect} />}
    </Box>
  );
};

export default ListSlot;

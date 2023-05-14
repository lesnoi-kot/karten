import { useState } from "react";
import { Box } from "@mui/material";

import { ID } from "models/types";

import { useTaskListDND } from "./hooks/taskListDragAndDrop";
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder";

type Props = {
  boardId: ID;
  taskListId: ID;
  children: React.ReactNode;
};

export default function TaskListSlot({ boardId, taskListId, children }: Props) {
  const [taskListRef, setRef] = useState<HTMLDivElement | null>(null);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

  const { dragPreviewRef, dragRef, dropRef, isDragging } = useTaskListDND({
    taskListRef,
    taskListId,
    boardId,
  });

  dragPreviewRef(dragRef(taskListRef));
  dropRef(wrapperRef);

  return (
    <Box
      position="relative"
      minWidth="250px"
      maxWidth="250px"
      width="250px"
      height="100%"
      ref={setWrapperRef}
    >
      <Box ref={setRef} py={1} borderRadius="2px" bgcolor="surfaces.50">
        {children}
      </Box>

      {isDragging && taskListRef?.getBoundingClientRect() && (
        <DragAndDropPlaceholder rect={taskListRef.getBoundingClientRect()} />
      )}
    </Box>
  );
}

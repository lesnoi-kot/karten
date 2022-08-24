import React, { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import { Box } from "@mui/material";

import * as models from "models/types";
import { TaskMovedPayload } from "app/apiInteraction/types";

import { DNDItem, DND_TASK_TYPE } from "./constants";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  index: number;
  taskId: models.ID;
  taskListId: models.ID;
  moveTask(args: TaskMovedPayload, commit: boolean): void;
};

const ListSlot = ({ children, taskId, moveTask, index }: Props) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DND_TASK_TYPE,
      item: () => ({ taskId, index } as DNDItem),
      collect: (monitor) => ({
        isDragging: monitor.getItem()?.taskId === taskId,
      }),
    }),
    [taskId, index]
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: DND_TASK_TYPE,
      hover(dragItem: DNDItem, monitor) {
        const { taskId: draggedId, index: draggedIndex } = dragItem;
        const offset = monitor.getClientOffset();

        if (ref && offset && monitor.isOver() && draggedId !== taskId) {
          console.log("HOVER TASK", { draggedIndex, index }, Date.now());
          const rect = ref.getBoundingClientRect();
          const atop = offset.y <= rect.y + rect.height / 2;

          moveTask({ taskId: draggedId, dropTaskId: taskId, atop }, false);
          dragItem.index = index;
        }
      },
      drop(dragItem: DNDItem) {},
    }),
    [ref, taskId, index, moveTask]
  );

  const box = isDragging ? ref?.getBoundingClientRect() : undefined;

  dragRef(dropRef(ref));

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

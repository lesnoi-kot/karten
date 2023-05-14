import { useRef } from "react";
import { produce } from "immer";
import { useDrop, useDrag, XYCoord } from "react-dnd";
import { useQueryClient } from "@tanstack/react-query";

import { ID, Task, Board } from "models/types";
import { useEditTask } from "queries/tasks";

import { DNDTaskItem, DND_TASK_TYPE } from "../constants";

type UseTaskDNDArgs = {
  boardId: ID;
  taskId: ID;
  taskRef: HTMLDivElement | null;
};

export function useTaskDND({ boardId, taskId, taskRef }: UseTaskDNDArgs) {
  const prevOffset = useRef<XYCoord | null>(null);
  const { mutate } = useEditTask(taskId);
  const queryClient = useQueryClient();

  function taskMoved(taskId: ID, targetId: ID, isBefore: boolean) {
    queryClient.setQueryData<Board>(["boards", { boardId }], (board) =>
      produce(board, (draft) => {
        draft?.moveTask({ taskId, targetId, isBefore });
      }),
    );
  }

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DND_TASK_TYPE,
      item: () => ({ taskId } as DNDTaskItem),
      collect: (monitor) => ({
        isDragging: monitor.getItem()?.taskId === taskId,
      }),
    }),
    [taskId],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: DND_TASK_TYPE,
      drop: (item: DNDTaskItem, monitor) => {
        if (!monitor.didDrop()) {
          const task = queryClient
            .getQueryData<Board>(["boards", { boardId }])
            ?.getTask(item.taskId);

          if (task) {
            mutate({ position: task.position });
          }
        }
      },
      hover(dragItem: DNDTaskItem, monitor) {
        const { taskId: draggedId } = dragItem;
        const offset = monitor.getClientOffset();
        const hoverBegin = monitor.isOver() === false;

        if (!taskRef || !offset || draggedId === taskId) {
          return;
        }

        if (hoverBegin) {
          const rect = taskRef.getBoundingClientRect();
          const isBefore = offset.y <= rect.y + rect.height / 2;
          taskMoved(draggedId, taskId, isBefore);
        } else if (prevOffset.current) {
          const yDiff = offset.y - prevOffset.current.y;

          if (yDiff !== 0) {
            taskMoved(draggedId, taskId, yDiff < 0);
          }
        }

        prevOffset.current = offset;
      },
    }),
    [taskRef, taskId],
  );

  return { dragPreviewRef, dragRef, dropRef, isDragging };
}

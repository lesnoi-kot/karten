import { useRef } from "react";
import { useDrop, useDrag, XYCoord } from "react-dnd";
import { useDispatch } from "react-redux";

import { actions as apiActions } from "app/apiInteraction";
import { ID } from "models/types";

import { DNDTaskItem, DND_TASK_TYPE } from "../constants";

type UseTaskDNDArgs = {
  taskId: ID;
  taskRef: HTMLDivElement | null;
};

export const useTaskDND = ({ taskId, taskRef }: UseTaskDNDArgs) => {
  const dispatch = useDispatch();
  const prevOffset = useRef<XYCoord>(null);

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
      hover(dragItem: DNDTaskItem, monitor) {
        const { taskId: draggedId } = dragItem;
        const offset = monitor.getClientOffset();
        const hoverBegin = monitor.isOver() === false;

        if (!taskRef || !offset || draggedId === taskId) {
          return;
        }

        const rect = taskRef.getBoundingClientRect();
        const isBefore = offset.y <= rect.y + rect.height / 2;

        if (hoverBegin) {
          dispatch(
            apiActions.moveTaskRequest({
              taskId: draggedId,
              dropTaskId: taskId,
              isBefore,
            }),
          );
        } else {
          const yDiff = offset.y - prevOffset.current!.y;

          if (yDiff !== 0) {
            dispatch(
              apiActions.moveTaskRequest({
                taskId: draggedId,
                dropTaskId: taskId,
                isBefore: yDiff < 0,
              }),
            );
          }
        }

        // @ts-expect-error
        prevOffset.current = offset;
      },
    }),
    [taskRef, taskId, dispatch],
  );

  dragRef(dropRef(taskRef));

  return { dragPreviewRef, isDragging };
};

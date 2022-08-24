import { useDrop, useDrag } from "react-dnd";

import { TaskMovedPayload } from "app/apiInteraction/types";
import { ID } from "models/types";

import { DNDItem, DND_LIST_TYPE, DND_TASK_TYPE } from "./constants";

type UseTaskListDNDArgs = {
  taskListId: ID;
  taskIds: ID[];
  moveTask(args: TaskMovedPayload, commit: boolean): void;
  taskListRef: HTMLDivElement | null;
};

export const useTaskListDND = ({
  taskListId,
  taskIds,
  moveTask,
  taskListRef,
}: UseTaskListDNDArgs) => {
  const [, listDropZoneRef] = useDrop(
    () => ({
      accept: [DND_TASK_TYPE],
      hover(item: DNDItem, monitor) {
        if (!taskListRef) {
          return;
        }

        const offset = monitor.getClientOffset();
        const rect = taskListRef.getBoundingClientRect();

        if (monitor.getItemType() === DND_TASK_TYPE) {
          const { taskId } = item;

          if (
            offset &&
            monitor.isOver({ shallow: true }) &&
            !taskIds.includes(taskId)
          ) {
            console.log("HOVER LIST", { taskListId, taskId });

            if (offset.y - rect.y <= 30) {
              moveTask(
                {
                  taskId,
                  dropTaskId: taskIds[0],
                  dropTaskListId: taskListId,
                  atop: true,
                },
                false
              );
              return;
            }

            if (rect.y + rect.height - offset.y <= 30) {
              moveTask(
                {
                  taskId,
                  dropTaskId: taskIds[taskIds.length - 1],
                  dropTaskListId: taskListId,
                  atop: false,
                },
                false
              );
              return;
            }
          }
        } else if (monitor.getItemType() === DND_LIST_TYPE) {
          //
        }
      },
    }),
    [taskListRef, taskListId, taskIds, moveTask]
  );

  listDropZoneRef(taskListRef);
  return [];
};

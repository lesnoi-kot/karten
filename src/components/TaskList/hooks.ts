import { useDrop, useDrag } from "react-dnd";
import { useDispatch } from "react-redux";

import { TaskMovedPayload } from "app/apiInteraction/types";
import { actions as taskListsActions } from "app/taskLists";
import { actions as apiActions } from "app/apiInteraction";
import { ID } from "models/types";

import {
  DNDTaskItem,
  DNDTaskListItem,
  DND_LIST_TYPE,
  DND_TASK_TYPE,
} from "./constants";

export type TaskMover = (args: TaskMovedPayload, commit: boolean) => void;
export type TaskListMover = (args: TaskMovedPayload) => void;

type UseTaskListDNDArgs = {
  taskListId: ID;
  taskIds: ID[];
  taskListRef: HTMLDivElement | null;
};

type UseTaskDNDArgs = {
  taskId: ID;
  taskRef: HTMLDivElement | null;
};

export const useTaskDND = ({ taskId, taskRef }: UseTaskDNDArgs) => {
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DND_TASK_TYPE,
      item: () => ({ taskId } as DNDTaskItem),
      collect: (monitor) => ({
        isDragging: monitor.getItem()?.taskId === taskId,
      }),
    }),
    [taskId]
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: DND_TASK_TYPE,
      hover(dragItem: DNDTaskItem, monitor) {
        const { taskId: draggedId } = dragItem;
        const offset = monitor.getClientOffset();

        if (taskRef && offset && monitor.isOver() && draggedId !== taskId) {
          const rect = taskRef.getBoundingClientRect();
          const atop = offset.y <= rect.y + rect.height / 2;

          dispatch(
            apiActions.moveTaskRequest({
              taskId: draggedId,
              dropTaskId: taskId,
              atop,
            })
          );
        }
      },
      drop(dragItem: DNDTaskItem) {},
    }),
    [taskRef, taskId, dispatch]
  );

  dragRef(dropRef(taskRef));

  return { dragPreviewRef, isDragging };
};

export const useTaskListDND = ({
  taskListId,
  taskIds,
  taskListRef,
}: UseTaskListDNDArgs) => {
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DND_LIST_TYPE,
      item: () => ({ taskListId } as DNDTaskListItem),
      collect: (monitor) => ({
        isDragging: monitor.getItem()?.taskListId === taskListId,
      }),
    }),
    [taskListId]
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: [DND_TASK_TYPE, DND_LIST_TYPE],
      hover(item: DNDTaskItem | DNDTaskListItem, monitor) {
        if (!taskListRef) {
          return;
        }

        const offset = monitor.getClientOffset();
        const rect = taskListRef.getBoundingClientRect();

        if (monitor.getItemType() === DND_TASK_TYPE) {
          const { taskId } = item as DNDTaskItem;

          if (
            offset &&
            monitor.isOver({ shallow: true }) &&
            !taskIds.includes(taskId)
          ) {
            console.log("HOVER LIST", { taskListId, taskId });

            if (offset.y - rect.y <= 30) {
              dispatch(
                apiActions.moveTaskRequest({
                  taskId,
                  dropTaskId: taskIds[0],
                  dropTaskListId: taskListId,
                  atop: true,
                })
              );
              return;
            }

            if (rect.y + rect.height - offset.y <= 30) {
              dispatch(
                apiActions.moveTaskRequest({
                  taskId,
                  dropTaskId: taskIds[taskIds.length - 1],
                  dropTaskListId: taskListId,
                  atop: false,
                })
              );
              return;
            }
          }
        } else if (monitor.getItemType() === DND_LIST_TYPE) {
          const dragTaskListId = (item as DNDTaskListItem).taskListId;
          if (
            offset &&
            monitor.isOver() &&
            taskListId !== (item as DNDTaskListItem).taskListId
          ) {
            const rect = taskListRef.getBoundingClientRect();
            const before = offset.x <= rect.x + rect.width / 2;

            dispatch(
              taskListsActions.taskListMoved({
                taskListId: dragTaskListId,
                dropTaskListId: taskListId,
                before,
              })
            );

            console.log("HOVER LIST", { taskListId });
          }
        }
      },
    }),
    [taskListRef, taskListId, taskIds]
  );

  dragRef(dropRef(taskListRef));

  return { isDragging, dragPreviewRef };
};

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
} from "../constants";

export type TaskMover = (args: TaskMovedPayload, commit: boolean) => void;
export type TaskListMover = (args: TaskMovedPayload) => void;

type UseTaskListDNDArgs = {
  taskListId: ID;
  taskIds: ID[];
  taskListRef: HTMLDivElement | null;
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
    [taskListId],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: [DND_TASK_TYPE, DND_LIST_TYPE],
      hover(item: DNDTaskItem | DNDTaskListItem, monitor) {
        const offset = monitor.getClientOffset();

        if (!taskListRef || !offset) {
          return;
        }

        const rect = taskListRef.getBoundingClientRect();

        if (monitor.getItemType() === DND_TASK_TYPE) {
          const { taskId } = item as DNDTaskItem;

          if (monitor.isOver({ shallow: true }) && !taskIds.includes(taskId)) {
            console.log("HOVER LIST", { taskListId, taskId });

            if (rect.y + rect.height - offset.y <= 32) {
              dispatch(
                apiActions.moveTaskRequest({
                  taskId,
                  dropTaskId: taskIds[taskIds.length - 1],
                  dropTaskListId: taskListId,
                  isBefore: false,
                }),
              );
              return;
            }

            dispatch(
              apiActions.moveTaskRequest({
                taskId,
                dropTaskId: taskIds[0],
                dropTaskListId: taskListId,
                isBefore: true,
              }),
            );
          }
        } else if (monitor.getItemType() === DND_LIST_TYPE) {
          const dragTaskListId = (item as DNDTaskListItem).taskListId;
          if (
            monitor.isOver() &&
            taskListId !== (item as DNDTaskListItem).taskListId
          ) {
            console.log("HOVER LIST", { taskListId });
            const rect = taskListRef.getBoundingClientRect();
            const before = offset.x <= rect.x + rect.width / 2;

            dispatch(
              taskListsActions.taskListMoved({
                taskListId: dragTaskListId,
                dropTaskListId: taskListId,
                before,
              }),
            );
          }
        }
      },
    }),
    [taskListRef, taskListId, taskIds],
  );

  return { isDragging, dragRef, dropRef, dragPreviewRef };
};

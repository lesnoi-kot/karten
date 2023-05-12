import { useDrop, useDrag } from "react-dnd";
import { produce } from "immer";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { ID, Board, TaskList, Task } from "models/types";
import { useAPI } from "context/APIProvider";

import {
  DNDTaskItem,
  DNDTaskListItem,
  DND_LIST_TYPE,
  DND_TASK_TYPE,
} from "../constants";

type UseTaskListDNDArgs = {
  boardId: ID;
  taskListId: ID;
  taskIds: ID[];
  taskListRef: HTMLDivElement | null;
};

export const useTaskListDND = ({
  boardId,
  taskListId,
  taskIds,
  taskListRef,
}: UseTaskListDNDArgs) => {
  const queryClient = useQueryClient();
  const api = useAPI();

  const { mutate: syncTask } = useMutation({
    mutationFn: (data: Task) => api.editTask({ ...data }),
  });

  const { mutate: syncTaskList } = useMutation({
    mutationFn: (data: TaskList) => api.editTaskList({ ...data }),
  });

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

  function taskMoved(taskId: ID, targetTaskListId: ID, isBefore: boolean) {
    queryClient.setQueryData<Board>(["boards", { boardId }], (board) =>
      produce(board, (draft) => {
        draft?.moveTask({ taskId, targetTaskListId, isBefore });
      }),
    );
  }

  function taskListMoved(
    taskListId: ID,
    targetTaskListId: ID,
    isBefore: boolean,
  ) {
    queryClient.setQueryData<Board>(["boards", { boardId }], (board) =>
      produce(board, (draft) => {
        draft?.moveTaskList({ taskListId, targetTaskListId, isBefore });
      }),
    );
  }

  const [, dropRef] = useDrop(
    () => ({
      accept: [DND_TASK_TYPE, DND_LIST_TYPE],
      drop: (item: DNDTaskItem | DNDTaskListItem, monitor) => {
        if (monitor.didDrop()) {
          return;
        }

        if (monitor.getItemType() === DND_TASK_TYPE) {
          const task = queryClient
            .getQueryData<Board>(["boards", { boardId }])
            ?.getTask((item as DNDTaskItem).taskId);

          if (task) {
            syncTask(task);
          }
        } else {
          const taskList = queryClient
            .getQueryData<Board>(["boards", { boardId }])
            ?.getTaskList((item as DNDTaskListItem).taskListId);

          if (taskList) {
            syncTaskList(taskList);
          }
        }
      },
      hover(item: DNDTaskItem | DNDTaskListItem, monitor) {
        const offset = monitor.getClientOffset();
        const type = monitor.getItemType();

        if (!taskListRef || !offset) {
          return;
        }

        const rect = taskListRef.getBoundingClientRect();

        if (type === DND_TASK_TYPE) {
          const { taskId } = item as DNDTaskItem;

          if (monitor.isOver({ shallow: true }) && !taskIds.includes(taskId)) {
            taskMoved(taskId, taskListId, rect.y + rect.height - offset.y > 32);
          }
        }

        if (type === DND_LIST_TYPE) {
          const dragTaskListId = (item as DNDTaskListItem).taskListId;

          if (monitor.isOver() && taskListId !== dragTaskListId) {
            const rect = taskListRef.getBoundingClientRect();
            const isBefore = offset.x <= rect.x + rect.width / 2;
            taskListMoved(dragTaskListId, taskListId, isBefore);
          }
        }
      },
    }),
    [taskListRef, taskListId, taskIds],
  );

  return { isDragging, dragRef, dropRef, dragPreviewRef };
};

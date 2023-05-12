import { produce } from "immer";
import { useState, useCallback } from "react";
import { Box, Stack, InputBaseComponentProps } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import * as models from "models/types";
import EditableTextField from "components/EditableTextField";
import TaskPreview from "components/Task/TaskPreview";

import { useTaskListDND } from "./hooks/taskListDragAndDrop";
import TaskComposer from "./TaskComposer";
import ListSlot from "./ListSlot";
import TaskListMenu from "./TaskListMenu";
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder";

type Props = {
  taskList: models.TaskList;
  onTaskClick(id: models.ID): void;
};

const nameStyle: InputBaseComponentProps = { style: { fontWeight: "bold" } };

export function TaskList({ taskList, onTaskClick }: Props) {
  const { id, boardId, name, tasks } = taskList;
  const api = useAPI();
  const queryClient = useQueryClient();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const isEmpty = tasks.length === 0;

  const { mutate: changeName } = useMutation({
    mutationFn: (newName: string) => api.editTaskList({ id, name: newName }),
    onMutate(newName) {
      queryClient.setQueryData<models.Board>(
        ["boards", { boardId: taskList.boardId }],
        (board) =>
          produce(board, (draft) => {
            draft?.getTaskList(taskList.id)?.setName(newName);
          }),
      );
    },
  });

  const onNameChange = useCallback(
    (newName: string) => {
      if (taskList.name !== newName) {
        changeName(newName);
      }
    },
    [taskList.name],
  );

  const { dragPreviewRef, dragRef, dropRef, isDragging } = useTaskListDND({
    taskListRef: ref,
    taskListId: id,
    boardId: taskList.boardId,
    taskIds: tasks.map((task) => task.id),
  });

  dragPreviewRef(dragRef(ref));
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
        <Box fontWeight="bold" paddingLeft={2} mb={1} display="flex">
          <EditableTextField
            value={name}
            onChange={onNameChange}
            fullWidth
            inputProps={nameStyle}
          />
          <TaskListMenu taskList={taskList} />
        </Box>

        <Stack direction="column" gap={0.5}>
          {tasks.map((task) => (
            <ListSlot key={task.id} taskList={taskList} taskId={task.id}>
              <TaskPreview
                taskList={taskList}
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            </ListSlot>
          ))}
        </Stack>

        <Box px={1} mt={isEmpty ? 0 : 1.5}>
          <TaskComposer boardId={boardId} taskListId={id} />
        </Box>
      </Box>

      {isDragging && ref?.getBoundingClientRect() && (
        <DragAndDropPlaceholder rect={ref.getBoundingClientRect()} />
      )}
    </Box>
  );
}

export default TaskList;

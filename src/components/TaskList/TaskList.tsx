import { memo } from "react";
import { Box, Stack } from "@mui/material";

import * as models from "models/types";
import TaskPreview from "components/Task/TaskPreview";

import TaskComposer from "./TaskComposer";
import ListSlot from "./ListSlot";
import TaskListSlot from "./TaskListSlot";
import TaskListMenu from "./TaskListMenu";
import TaskListName from "./TaskListName";

type Props = {
  taskList: models.TaskList;
  onTaskClick(id: models.ID): void;
};

function TaskList({ taskList, onTaskClick }: Props) {
  const { id, boardId, tasks } = taskList;

  return (
    <TaskListSlot boardId={boardId} taskListId={id}>
      <>
        <Box fontWeight="bold" paddingLeft={2} mb={1} display="flex">
          <TaskListName taskList={taskList} />
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

        <Box px={1} mt={tasks.length === 0 ? 0 : 1.5}>
          <TaskComposer boardId={boardId} taskListId={id} />
        </Box>
      </>
    </TaskListSlot>
  );
}

export default memo(TaskList);

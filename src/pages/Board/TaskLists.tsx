import { Stack } from "@mui/material";

import { ID, Board } from "models/types";

import TaskList from "components/TaskList";
import NewListPlaceholder from "components/TaskList/NewListPlaceholder";

type Props = {
  board: Board;
  onTaskClick: (id: ID) => void;
};

export function TaskLists({ board, onTaskClick }: Props) {
  const { id: boardId, taskLists } = board;

  return (
    <Stack gap={1} direction="row" alignItems="flex-start" height="100%">
      {taskLists.map((taskList) => (
        <TaskList
          key={taskList.id}
          taskList={taskList}
          onTaskClick={onTaskClick}
        />
      ))}

      <NewListPlaceholder boardId={boardId} />
    </Stack>
  );
}

export default TaskLists;

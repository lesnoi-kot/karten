import React from "react";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";

import { RootState } from "app";
import { ID } from "models/types";
import { selectSortedTaskListIds } from "app/boards/selectors";

import TaskList from "components/TaskList";
import NewListPlaceholder from "components/TaskList/NewListPlaceholder";

export function TaskLists({
  boardId,
  onTaskClick,
}: {
  boardId: ID;
  onTaskClick: any;
}) {
  const lists = useSelector((state: RootState) =>
    selectSortedTaskListIds(state, boardId),
  );

  return (
    <Stack gap={1} direction="row" alignItems="flex-start" height="100%">
      {lists.map((id: ID) => (
        <TaskList
          key={id}
          boardId={boardId}
          id={id}
          onTaskClick={onTaskClick}
        />
      ))}

      <NewListPlaceholder boardId={boardId} />
    </Stack>
  );
}

export default React.memo(TaskLists);

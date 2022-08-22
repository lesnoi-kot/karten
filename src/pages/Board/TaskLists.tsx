import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";

import { RootState } from "app";
import logger from "services/logger";
import { ID } from "models/types";
import { selectTaskListIds } from "app/boards/selectors";

import TaskList from "components/TaskList";
import NewListPlaceholder from "components/TaskList/NewListPlaceholder";

export function TaskLists({
  boardId,
  onTaskClick,
}: {
  boardId: ID;
  onTaskClick: any;
}) {
  logger.debug("Render: TaskLists", boardId);
  const lists = useSelector((state: RootState) =>
    selectTaskListIds(state, boardId)
  );

  return (
    <Grid container spacing={1} wrap="nowrap">
      {lists.map((id: ID) => (
        <Grid item key={id}>
          <TaskList boardId={boardId} id={id} onTaskClick={onTaskClick} />
        </Grid>
      ))}

      <Grid item key="NewListPlaceholder">
        <NewListPlaceholder boardId={boardId} />
      </Grid>
    </Grid>
  );
}

export default React.memo(TaskLists);

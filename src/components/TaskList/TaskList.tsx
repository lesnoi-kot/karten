import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";

import * as models from "models/types";
import logger from "services/logger";
import { selectTaskListById, selectTaskIds } from "app/taskLists/selectors";
import Stub from "components/Stub";
import EditableTextField from "components/EditableTextField";
import { actions as apiActions } from "app/apiInteraction";
import TaskPreview from "components/Task/TaskPreview";

import TaskComposer from "./TaskComposer";
import ListSection from "./ListSection";
import ListSlot from "./ListSlot";
import TaskListMenu from "./TaskListMenu";
import styles from "./styles.module.css";

type Props = {
  id: models.ID;
  boardId: models.ID;
  onTaskClick(id: models.ID): void;
};

const nameStyle = { style: { fontWeight: "bold" } };

export function TaskList({ id, boardId, onTaskClick }: Props) {
  const dispatch = useDispatch();
  const taskList = useSelector((state) => selectTaskListById(state, id));
  const taskIds = useSelector((state) => selectTaskIds(state, id));

  const onNameChange = useCallback(
    (newName: string) => {
      if (taskList.name !== newName) {
        dispatch(
          apiActions.updateTaskListRequest({
            taskListId: id,
            boardId,
            name: newName,
          })
        );
      }
    },
    [id, boardId, dispatch, taskList]
  );

  if (!taskList) {
    return <Stub />;
  }

  const { name } = taskList;
  logger.debug("Render: TaskList", id, name);

  return (
    <Box py={1} px={2} className={styles.list}>
      <ListSection fontWeight="bold" mb={1} paddingLeft={1} display="flex">
        <EditableTextField
          value={name}
          onChange={onNameChange}
          fullWidth
          inputProps={nameStyle}
        />
        <TaskListMenu id={id} boardId={boardId} />
      </ListSection>

      <ListSection>
        <Grid container spacing={1} direction="row">
          {taskIds.map((taskId, index) => (
            <ListSlot key={taskId} index={index}>
              <TaskPreview id={taskId} onClick={onTaskClick} />
            </ListSlot>
          ))}
        </Grid>
      </ListSection>

      <ListSection mt={taskIds.length === 0 ? 0 : 2}>
        <TaskComposer taskListId={id} boardId={boardId} />
      </ListSection>
    </Box>
  );
}

export default React.memo(TaskList);

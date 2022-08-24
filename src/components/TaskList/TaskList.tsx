import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";

import * as models from "models/types";
import { RootState } from "app";
import logger from "services/logger";
import {
  selectTaskListById,
  selectSortedTaskIds,
} from "app/taskLists/selectors";
import Stub from "components/Stub";
import EditableTextField from "components/EditableTextField";
import { actions as apiActions } from "app/apiInteraction";
import { TaskMovedPayload } from "app/apiInteraction/types";
import TaskPreview from "components/Task/TaskPreview";

import TaskComposer from "./TaskComposer";
import ListSection from "./ListSection";
import ListSlot from "./ListSlot";
import TaskListMenu from "./TaskListMenu";
import styles from "./styles.module.css";
import { useTaskListDND } from "./hooks";

type Props = {
  id: models.ID;
  boardId: models.ID;
  onTaskClick(id: models.ID): void;
};

const nameStyle = { style: { fontWeight: "bold" } };

export function TaskList({ id, boardId, onTaskClick }: Props) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const taskList = useSelector((state: RootState) =>
    selectTaskListById(state, id)
  );

  const taskIds = useSelector((state: RootState) =>
    selectSortedTaskIds(state, id)
  );

  const moveTask = useCallback(
    (args: TaskMovedPayload, commit: boolean) => {
      dispatch(apiActions.moveTaskRequest(args));
    },
    [dispatch]
  );

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

  useTaskListDND({
    taskListRef: ref,
    taskListId: id,
    moveTask,
    taskIds,
  });

  if (!taskList) {
    return <Stub />;
  }

  const { name } = taskList;
  logger.debug("Render: TaskList", id, name, Date.now());

  return (
    <Box py={1} px={2} className={styles.list} ref={setRef}>
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
        <Grid container direction="row">
          {taskIds.map((taskId, index) => (
            <Grid item xs={12} key={taskId}>
              <ListSlot
                index={index}
                taskId={taskId}
                taskListId={id}
                moveTask={moveTask}
              >
                <TaskPreview id={taskId} onClick={onTaskClick} />
              </ListSlot>
            </Grid>
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

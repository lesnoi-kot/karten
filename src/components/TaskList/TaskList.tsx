import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, InputBaseComponentProps } from "@mui/material";

import * as models from "models/types";
import { RootState } from "app";
import {
  selectTaskListById,
  selectSortedTaskIds,
} from "app/taskLists/selectors";
import Stub from "components/Stub";
import EditableTextField from "components/EditableTextField";
import { actions as apiActions } from "app/apiInteraction";
import TaskPreview from "components/Task/TaskPreview";

import { useTaskListDND } from "./hooks/taskListDragAndDrop";

import TaskComposer from "./TaskComposer";
import ListSlot from "./ListSlot";
import TaskListMenu from "./TaskListMenu";
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder";

import styles from "./styles.module.css";

type Props = {
  id: models.ID;
  boardId: models.ID;
  onTaskClick(id: models.ID): void;
};

const nameStyle: InputBaseComponentProps = { style: { fontWeight: "bold" } };

export function TaskList({ id, boardId, onTaskClick }: Props) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const taskList = useSelector((state: RootState) =>
    selectTaskListById(state, id),
  );

  const taskIds = useSelector((state: RootState) =>
    selectSortedTaskIds(state, id),
  );
  const isEmpty = taskIds.length === 0;

  const onNameChange = useCallback(
    (newName: string) => {
      if (taskList.name !== newName) {
        dispatch(
          apiActions.updateTaskListRequest({
            taskListId: id,
            boardId,
            name: newName,
          }),
        );
      }
    },
    [id, boardId, dispatch, taskList],
  );

  const { dragPreviewRef, dragRef, dropRef, isDragging } = useTaskListDND({
    taskListRef: ref,
    taskListId: id,
    taskIds,
  });

  dragPreviewRef(dragRef(ref));
  dropRef(wrapperRef);

  if (!taskList) {
    return <Stub />;
  }

  const { name } = taskList;

  return (
    <Box className={styles.wrapper} ref={setWrapperRef}>
      <Box ref={setRef} py={1} className={styles.list}>
        <Box fontWeight="bold" paddingLeft={2} mb={1} display="flex">
          <EditableTextField
            value={name}
            onChange={onNameChange}
            fullWidth
            inputProps={nameStyle}
          />
          <TaskListMenu id={id} boardId={boardId} />
        </Box>

        <Grid container direction="row" gap={0.5}>
          {taskIds.map((taskId) => (
            <Grid item xs={12} key={taskId}>
              <ListSlot taskId={taskId}>
                <TaskPreview id={taskId} onClick={onTaskClick} />
              </ListSlot>
            </Grid>
          ))}
        </Grid>

        <Box px={1} mt={isEmpty ? 0 : 1.5}>
          <TaskComposer taskListId={id} boardId={boardId} />
        </Box>
      </Box>

      {isDragging && (
        <DragAndDropPlaceholder rect={ref?.getBoundingClientRect()} />
      )}
    </Box>
  );
}

export default React.memo(TaskList);

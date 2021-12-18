import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";

import { actions as apiActions } from "app/apiInteraction";
import { Task } from "models/types";
import EditableText from "components/EditableTextField";

import styles from "./styles.module.css";

export type Props = {
  task: Task;
};

function NameEditor({ task }: Props) {
  const { id: taskId, name } = task;
  const dispatch = useDispatch();

  const onNameChange = useCallback(
    (newName: string) => {
      if (name !== newName) {
        dispatch(apiActions.updateTaskRequest({ taskId, name: newName }));
      }
    },
    [taskId, dispatch, name]
  );

  return (
    <>
      <EditableText
        value={name}
        onChange={onNameChange}
        className={styles.nameField}
      />
    </>
  );
}

export default NameEditor;

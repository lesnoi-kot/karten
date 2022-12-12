import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, IconButton, CardProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { RootState } from "app";
import { ID } from "models/types";
import { selectTaskById } from "app/tasks/selectors";
import { actions as apiActions } from "app/apiInteraction";

import styles from "./styles.module.css";
import Stub from "../Stub";

export type Props = Omit<CardProps, "onClick"> & {
  id: ID;
  onClick(id: ID): void;
};

function TaskPreview({ id, onClick }: Props) {
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => selectTaskById(state, id));

  if (!task) {
    return <Stub source="TaskPreview" />;
  }

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(
      apiActions.deleteTaskRequest({
        taskListId,
        taskId: id,
      }),
    );
  };

  const { taskListId, name, position } = task;

  return (
    <Card
      className={styles.taskPreview}
      onClick={() => onClick(id)}
      variant="outlined"
    >
      <CardHeader
        title={name + ` - ${position}`}
        sx={{ padding: "8px" }}
        disableTypography
        action={
          <IconButton
            aria-label="settings"
            size="small"
            onClick={onDeleteClick}
          >
            <DeleteIcon fontSize="small" color="action" />
          </IconButton>
        }
      />
    </Card>
  );
}

export default React.memo(TaskPreview);

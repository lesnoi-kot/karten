import React from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { Card, CardHeader, IconButton, CardProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { ID } from "models/types";
import { selectTaskById } from "app/tasks/selectors";
import { actions as apiActions } from "app/apiInteraction";

import styles from "./styles.module.css";
import Stub from "../Stub";
import { RootState } from "app";

export type Props = Omit<CardProps, "onClick"> & {
  id: ID;
  blurred?: boolean;
  onClick(id: ID): void;
};

function TaskPreview({ id, blurred = false, onClick, className }: Props) {
  const task = useSelector((state: RootState) => selectTaskById(state, id));
  const dispatch = useDispatch();

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(
      apiActions.deleteTaskRequest({
        taskListId,
        taskId: id,
      })
    );
  };

  if (!task) {
    return <Stub source="TaskPreview" />;
  }

  const { taskListId, name, position } = task;

  return (
    <Card
      className={clsx(styles.taskPreview, className, blurred && styles.blurred)}
      onClick={() => onClick(id)}
      variant="outlined"
    >
      <CardHeader
        title={name + ` - ${position}`}
        action={
          <IconButton
            aria-label="settings"
            size="small"
            onClick={onDeleteClick}
          >
            <DeleteIcon fontSize="small" color="action" />
          </IconButton>
        }
        titleTypographyProps={{ variant: "body2" }}
        classes={{
          root: styles.taskPreviewHeader,
          action: styles.taskPreviewButton,
        }}
      />
    </Card>
  );
}

export default React.memo(TaskPreview);

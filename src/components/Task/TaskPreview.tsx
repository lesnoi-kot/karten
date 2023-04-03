import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, IconButton, CardProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

import { RootState } from "app";
import { ID } from "models/types";
import { selectTaskById } from "app/tasks/selectors";
import { actions as apiActions } from "app/apiInteraction";

import Stub from "../Stub";

export type Props = CardProps & { id: ID };

const TaskCard = styled(Card)<CardProps>(() => ({
  width: "100%",
  cursor: "pointer",
  whiteSpace: "pre",
  userSelect: "none",
}));

function TaskPreview({ id, ...cardProps }: Props) {
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => selectTaskById(state, id));

  if (!task) {
    return <Stub source="TaskPreview" />;
  }

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(apiActions.deleteTaskRequest(id));
  };

  const { name } = task;

  return (
    <TaskCard variant="outlined" {...cardProps}>
      <CardHeader
        title={name}
        sx={{ padding: 1 }}
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
    </TaskCard>
  );
}

export default React.memo(TaskPreview);

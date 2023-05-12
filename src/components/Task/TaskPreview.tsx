import React from "react";
import { produce } from "immer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, IconButton, CardProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

import { useAPI } from "context/APIProvider";
import { Board, TaskList, Task } from "models/types";

export type Props = CardProps & { taskList: TaskList; task: Task };

const TaskCard = styled(Card)<CardProps>(() => ({
  width: "100%",
  cursor: "pointer",
  whiteSpace: "pre",
  userSelect: "none",
}));

export default function TaskPreview({ task, taskList, ...cardProps }: Props) {
  const { name } = task;
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => api.deleteTask(task.id),
    onMutate() {
      queryClient.setQueryData<Board>(
        ["boards", { boardId: taskList.boardId }],
        (board) =>
          produce(board, (draft) => {
            draft?.deleteTask(task.id);
          }),
      );
    },
  });

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteTask();
  };

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

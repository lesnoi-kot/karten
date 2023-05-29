import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Stack,
  Card,
  Badge,
  CardHeader,
  IconButton,
  CardContent,
  CardProps,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import { styled } from "@mui/material/styles";

import { useAPI } from "context/APIProvider";
import { TaskList, Task } from "models/types";
import { useOptimisticBoardMutation } from "queries/boards";
import { useTask } from "queries/tasks";

export type Props = CardProps & { taskList: TaskList; task: Task };

const TaskCard = styled(Card)<CardProps>(() => ({
  width: "100%",
  cursor: "pointer",
  userSelect: "none",
}));

export default function TaskPreview({
  task: initialTask,
  taskList,
  ...cardProps
}: Props) {
  const { query } = useTask(initialTask.id, {
    initialData: initialTask,
    queryEnabled: false,
  });

  const task = query.data ?? initialTask;
  const { name, labels, comments, text } = task;
  const api = useAPI();
  const mutateBoard = useOptimisticBoardMutation();

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => api.deleteTask(task.id),
    onMutate() {
      mutateBoard((draft) => {
        draft?.deleteTask(task.id);
      });
    },
  });

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteTask();
  };

  const showTaskFooter = [text, labels.length, comments.length].some(Boolean);

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
      <CardContent
        sx={{
          padding: 1,
          display: showTaskFooter ? "block" : "none",
          "&:last-child": {
            paddingBottom: 1,
          },
        }}
      >
        <Stack gap={1.5}>
          <Stack direction="row" gap={1} alignItems="center">
            {!!text && (
              <NotesIcon fontSize="small" titleAccess="Task has description" />
            )}
            {comments.length > 0 && (
              <Badge
                badgeContent={comments.length}
                color="primary"
                title={`Number of comments: ${comments.length}`}
              >
                <CommentOutlinedIcon fontSize="small" />
              </Badge>
            )}
          </Stack>
          {labels.length > 0 && (
            <Stack direction="row" gap={1}>
              {labels.map((label) => (
                <Box
                  borderRadius="5px"
                  title={label.name}
                  key={label.id}
                  height="10px"
                  width="30px"
                  bgcolor={label.color}
                  component="div"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </TaskCard>
  );
}

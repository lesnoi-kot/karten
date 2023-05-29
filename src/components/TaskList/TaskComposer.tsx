import { memo, useState, useRef, KeyboardEventHandler } from "react";
import { produce } from "immer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, TextField, IconButton, Collapse, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

import { useAppDispatch } from "store/hooks";
import { showSnackbar } from "store/snackbars";
import { ID, Board } from "models/types";
import { useAPI } from "context/APIProvider";

type Props = { taskListId: ID; boardId: ID };

function TaskComposer({ taskListId, boardId }: Props) {
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const [formIsVisible, toggleForm] = useState(false);
  const api = useAPI();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const { mutate: addTask, isLoading } = useMutation({
    mutationFn: () =>
      api.addTask({
        name: textFieldRef.current?.value.trim() || "",
        position: Date.now(),
        taskListId,
      }),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Board>(["boards", { boardId }], (board) =>
        produce(board, (draft) => {
          draft?.getTaskList(taskListId)?.addTask(newTask);
        }),
      );

      if (textFieldRef.current) {
        textFieldRef.current.value = "";
      }

      setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
    },
    onError(error) {
      dispatch(
        showSnackbar({
          message: String(error),
          type: "error",
        }),
      );
    },
  });

  const submit = () => {
    const normalizedTitle = textFieldRef.current?.value.trim();

    if (normalizedTitle) {
      addTask();
    } else {
      textFieldRef.current?.select();
    }
  };

  const onBlur = () => {
    if (!textFieldRef.current?.value) {
      toggleForm(false);
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      submit();
    } else if (e.key === "Escape") {
      toggleForm(false);
      e.stopPropagation();
    }
  };

  return (
    <Box>
      <Collapse
        in={formIsVisible}
        onAnimationEnd={() => {
          if (textFieldRef.current) {
            textFieldRef.current.value = "";
          }
        }}
        unmountOnExit
      >
        <TextField
          inputRef={textFieldRef}
          disabled={isLoading}
          onBlur={onBlur}
          autoFocus
          placeholder="Enter title for this card..."
          fullWidth
          minRows={2}
          multiline
          margin="dense"
          variant="outlined"
          size="small"
          onKeyDown={onKeyDown}
        />
        <Box mt={1} />
      </Collapse>
      <Stack spacing={1} direction="row">
        <LoadingButton
          variant="contained"
          size="small"
          loading={isLoading}
          onClick={(event) => {
            if (formIsVisible) {
              event.stopPropagation();
              submit();
            } else {
              toggleForm(true);
            }
          }}
          disableElevation
          startIcon={formIsVisible ? null : <AddIcon />}
        >
          {formIsVisible ? "Add card" : "Add a card"}
        </LoadingButton>

        {formIsVisible && (
          <IconButton
            size="small"
            onClick={() => {
              toggleForm(false);
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}

export default memo(TaskComposer);

import React, { useState, useRef, KeyboardEventHandler } from "react";

import {
  Box,
  Button,
  TextField,
  IconButton,
  Collapse,
  Fade,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

import { ID } from "models/types";
import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";

function TaskComposer({ taskListId }: { taskListId: ID }) {
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const [formIsVisible, toggleForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const { isLoading, load } = useRequest(apiActions.addTaskRequest, {
    onSuccess() {
      setTaskTitle("");
      textFieldRef?.current?.select();
    },
  });

  const showForm = () => {
    toggleForm(true);
  };

  const hideForm = () => {
    toggleForm(false);
    setTaskTitle("");
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setTaskTitle(e.target.value);

  const submit = () => {
    const normalizedTitle = taskTitle.trim();

    if (normalizedTitle) {
      load({
        name: normalizedTitle,
        position: Date.now(),
        taskListId,
      });
    } else {
      textFieldRef?.current?.select();
    }
  };

  const onBlur = () => {
    if (!taskTitle) {
      hideForm();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      submit();
    } else if (e.key === "Escape") {
      hideForm();
      e.stopPropagation();
    }
  };

  return (
    <Box>
      <Collapse
        in={formIsVisible}
        onEntered={() => textFieldRef.current?.focus()}
      >
        <TextField
          value={taskTitle}
          onChange={onChange}
          inputRef={textFieldRef}
          disabled={isLoading}
          onBlur={onBlur}
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
        <Grid container spacing={1} direction="row">
          <Grid item>
            <LoadingButton
              variant="contained"
              size="small"
              loading={isLoading}
              onClick={(event) => {
                event.stopPropagation();
                submit();
              }}
              disabled={!taskTitle}
              startIcon={<CheckIcon />}
            >
              Add card
            </LoadingButton>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={hideForm}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Collapse>

      {!formIsVisible && (
        <Fade in timeout={500}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={showForm}
            disableElevation
          >
            Add a card
          </Button>
        </Fade>
      )}
    </Box>
  );
}

export default TaskComposer;

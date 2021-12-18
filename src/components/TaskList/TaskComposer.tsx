import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEventHandler } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

import {
  Box,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

import * as models from "models/types";
import { FetchState } from "utils/types";
import { actions as apiActions, selectors } from "app/apiInteraction";

import styles from "./styles.module.css";

const textFieldInputProps = {
  classes: {
    root: styles.taskComposerInput,
    focused: styles.taskComposerInput,
  },
};

type Props = {
  taskListId: models.ID;
  boardId: models.ID;
};

function TaskComposer({ taskListId, boardId }: Props) {
  const dispatch = useDispatch();
  const taskListMeta = useSelector(selectors.selectTaskListMeta(taskListId));
  const isTaskAdding = useSelector(selectors.selectIsTaskAdding(taskListId));

  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const [formIsVisible, toggleForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    if (taskListMeta?.taskAddState === FetchState.FULFILLED) {
      setTaskTitle("");
      textFieldRef?.current?.select();
    }
  }, [taskListMeta]);

  const showForm = () => {
    toggleForm(true);
  };

  const hideForm = () => {
    toggleForm(false);
    setTaskTitle("");
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setTaskTitle(e.target.value);

  const submit = debounce(() => {
    const normalizedTitle = taskTitle.trim();

    if (normalizedTitle) {
      dispatch(
        apiActions.addTaskRequest({
          title: normalizedTitle,
          taskListId,
          boardId,
        })
      );
    } else {
      textFieldRef?.current?.select();
    }
  }, 100);

  const onBlur = () => {
    if (!taskTitle) {
      hideForm();
    } else {
      submit();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "Escape") {
      hideForm();
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
          disabled={isTaskAdding}
          onBlur={onBlur}
          placeholder="Enter title for this card..."
          fullWidth
          rows={1}
          variant="outlined"
          InputProps={{ ...textFieldInputProps, onKeyDown }}
        />
        <Box mt={1} />
        <Grid container spacing={1} direction="row">
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                submit();
              }}
              disabled={!taskTitle}
              startIcon={
                isTaskAdding ? <CircularProgress size={15} /> : <CheckIcon />
              }
            >
              Add
            </Button>
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
            startIcon={<AddIcon />}
            onClick={showForm}
            disableElevation
          >
            Add a task
          </Button>
        </Fade>
      )}
    </Box>
  );
}

export default TaskComposer;

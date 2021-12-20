import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Box, Button, TextField, Typography } from "@mui/material";

import { actions as apiActions } from "app/apiInteraction";
import { Task } from "models/types";

import styles from "./styles.module.css";

export type Props = {
  task: Task;
};

function DescriptionEditor({ task }: Props) {
  const dispatch = useDispatch();
  const { id: taskId, text: initialDescription } = task;
  const [readonly, setReadonly] = useState(true);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const onDescriptionChange = () => {
    if (initialDescription !== description) {
      dispatch(apiActions.updateTaskRequest({ taskId, text: description }));
    }
    setReadonly(true);
  };

  const onCloseEditor = () => {
    setDescription(initialDescription);
    setReadonly(true);
  };

  return (
    <>
      <Box display="flex" flexDirection="row" gap={1}>
        <Typography variant="h6" component="h2">
          Description
        </Typography>
        {readonly && (
          <Button
            onClick={() => setReadonly(false)}
            size="small"
            variant="text"
          >
            Edit
          </Button>
        )}
      </Box>
      <Box mt={1} />
      {readonly ? (
        <Typography>{description}</Typography>
      ) : (
        <>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            InputProps={{
              minRows: 3,
            }}
            rows={3}
            variant="outlined"
            className={styles.textfield}
          />
          <Box mt={1} display="flex" gap={0.5}>
            <Button
              onClick={onDescriptionChange}
              variant="outlined"
              size="small"
            >
              Save
            </Button>
            &nbsp;
            <Button onClick={onCloseEditor} variant="outlined" size="small">
              Close
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

export default DescriptionEditor;

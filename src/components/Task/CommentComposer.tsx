import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ID } from "models/types";
import { actions as apiActions } from "app/apiInteraction";
import { useRequestInfo } from "app/apiInteraction/hooks";

import styles from "./styles.module.css";

type Props = {
  taskId: ID;
};

function CommentComposer({ taskId }: Props) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const { isLoading } = useRequestInfo(`CommentComposer:${taskId}`);

  useEffect(() => {
    if (!isLoading) {
      setText("");
      setFocused(false);
    }
  }, [isLoading]);

  const onSubmit = () => {
    dispatch(
      apiActions.addCommentRequest({
        taskId,
        text,
        requestKey: `CommentComposer:${taskId}`,
      })
    );
  };

  return (
    <Box>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        fullWidth
        placeholder="Write a comment"
        className={styles.textfield}
        rows={focused ? 2 : 0}
        variant="outlined"
        onFocus={() => setFocused(true)}
        onBlur={() => !text && setFocused(false)}
      />
      {focused && (
        <>
          <Box mt={1} />
          <LoadingButton
            loading={isLoading}
            onClick={onSubmit}
            disabled={text.trim() === ""}
            variant="outlined"
          >
            Save
          </LoadingButton>
        </>
      )}
    </Box>
  );
}

export default CommentComposer;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Typography, Button } from "@mui/material";

import { ID } from "models/types";
import { actions as apiActions } from "app/apiInteraction";

import styles from "./styles.module.css";

type Props = {
  taskId: ID;
};

function CommentComposer({ taskId }: Props) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const onSubmit = () => {
    dispatch(apiActions.addCommentRequest({ taskId, text }));
    setText("");
    setFocused(false);
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
        onBlur={() => setFocused(false)}
      />
      <Box mt={1} />
      {focused && (
        <Button
          onClick={onSubmit}
          disabled={text.trim() === ""}
          variant="outlined"
        >
          Save
        </Button>
      )}
    </Box>
  );
}

export default CommentComposer;

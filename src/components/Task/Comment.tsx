import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";

import { ID } from "models/types";
import Stub from "components/Stub";
import { actions as apiActions } from "app/apiInteraction";

import styles from "./styles.module.css";
import { selectCommentById } from "app/comments/selectors";

type Props = {
  commentId: ID;
};

export function Comment({ commentId }: Props) {
  const dispatch = useDispatch();
  const comment = useSelector((state) => selectCommentById(state, commentId));

  if (!comment) {
    return <Stub />;
  }

  const onDelete = () => {
    dispatch(apiActions.deleteCommentRequest({ commentId }));
  };

  return (
    <Box className={styles.comment}>
      <Box className={styles.commentAvatar}>
        <Avatar>Y</Avatar>
      </Box>
      <Typography gutterBottom>
        <b>Yuko</b>
      </Typography>
      <Paper className={styles.commentText} variant="outlined">
        {comment.text}
      </Paper>
      <Box mt={1}>
        <Button size="small">Edit</Button>
        <Button size="small" onClick={onDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(Comment);

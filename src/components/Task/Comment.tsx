import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";

import { ID } from "models/types";
import Stub from "components/Stub";
import { actions as apiActions } from "app/apiInteraction";
import { selectCommentById } from "app/comments/selectors";
import { useRequestInfo } from "app/apiInteraction/hooks";

import styles from "./styles.module.css";
import CommentEditor from "./CommentEditor";

type Props = {
  commentId: ID;
};

export function Comment({ commentId }: Props) {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const comment = useSelector((state) => selectCommentById(state, commentId));
  const { isLoading } = useRequestInfo(`CommentEditor:${commentId}`);

  useEffect(() => {
    if (!isLoading) {
      setEditMode(false);
    }
  }, [isLoading]);

  if (!comment) {
    return <Stub />;
  }

  const onDelete = () => {
    dispatch(apiActions.deleteCommentRequest({ commentId }));
  };

  const onEdit = (text: string) => {
    dispatch(
      apiActions.updateCommentRequest({
        commentId,
        text,
        requestKey: `CommentEditor:${commentId}`,
      })
    );
  };

  return (
    <Box className={styles.comment}>
      <Box className={styles.commentAvatar}>
        <Avatar>Y</Avatar>
      </Box>
      <Typography gutterBottom>
        <b>Yuko</b>
      </Typography>
      {editMode ? (
        <CommentEditor
          text={comment.text}
          onClose={() => setEditMode(false)}
          onSubmit={onEdit}
          isLoading={isLoading}
        />
      ) : (
        <Paper className={styles.commentText} variant="outlined">
          {comment.text}
        </Paper>
      )}

      {!editMode && (
        <Box mt={1} display="flex" gap={1}>
          <Button size="small" onClick={() => setEditMode(true)}>
            Edit
          </Button>
          <Button size="small" onClick={onDelete}>
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default React.memo(Comment);

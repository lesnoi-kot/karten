import React, { useState, useMemo } from "react";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";

import { ID } from "models/types";
import Stub from "components/Stub";
import { actions as apiActions } from "app/apiInteraction";
import { selectCommentById } from "app/comments/selectors";
import { useRequest } from "app/apiInteraction/hooks";
import { useAppDispatch, useAppSelector } from "app/hooks";

import CommentEditor from "./CommentEditor";
import { Markdown } from "components/Markdown";

type Props = {
  commentId: ID;
};

export function Comment({ commentId }: Props) {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();
  const comment = useAppSelector((state) =>
    selectCommentById(state, commentId),
  );

  const { load: updateComment, isLoading } = useRequest(
    apiActions.updateCommentRequest,
    {
      onSuccess() {
        setEditMode(false);
      },
    },
  );

  if (!comment) {
    return <Stub />;
  }

  const onDelete = () => {
    dispatch(apiActions.deleteCommentRequest(commentId));
  };

  return (
    <Box position="relative" pl="50px">
      <Box position="absolute" width="40px" height="40px" sx={{ inset: 0 }}>
        <Avatar>Y</Avatar>
      </Box>
      <Typography gutterBottom>
        <b>Yuko</b>
      </Typography>

      {editMode ? (
        <CommentEditor
          text={comment.text}
          onClose={() => setEditMode(false)}
          onSubmit={(text: string) => {
            updateComment({ id: commentId, text });
          }}
          isLoading={isLoading}
        />
      ) : (
        <Paper variant="outlined" sx={{ padding: 1 }}>
          <Markdown md={comment.text} />
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

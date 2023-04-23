import { useState, useMemo } from "react";
import { Box, Paper, Typography, Avatar, Button, Stack } from "@mui/material";

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

export default function Comment({ commentId }: Props) {
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
    <Stack
      position="relative"
      direction="row"
      gap={1}
      alignItems="stretch"
      fontSize="1rem"
    >
      <Box width="40px" flexShrink="0">
        <Avatar sx={{ position: "sticky", top: (theme) => theme.spacing(2) }}>
          Y
        </Avatar>
      </Box>

      <Box flexGrow="1">
        <Stack gap={2} direction="row" alignItems="center">
          <Typography fontWeight="bold">Yuko</Typography>
          <Typography variant="body2">
            {new Date(comment.dateCreated).toLocaleString()}
          </Typography>
        </Stack>

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
          <Paper variant="outlined" sx={{ paddingX: 1 }}>
            <Markdown html={comment.text} />
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
    </Stack>
  );
}

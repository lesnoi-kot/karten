import React from "react";
import { useSelector } from "react-redux";
import { Box, Stack, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

import { ID } from "models/types";
import { selectSortedCommentsId } from "app/comments/selectors";

import Comment from "./Comment";
import CommentComposer from "./CommentComposer";
import { RootState } from "app";

type Props = {
  taskId: ID;
};

function Comments({ taskId }: Props) {
  const comments = useSelector((state: RootState) =>
    selectSortedCommentsId(state, taskId),
  );

  return (
    <Box>
      <Stack alignItems="center" flexDirection="row" gap={1}>
        <CommentIcon />
        <Typography variant="h6" component="h2">
          Comments ({comments.length})
        </Typography>
      </Stack>

      <Box mt={1}>
        <CommentComposer taskId={taskId} />
      </Box>

      {comments.length > 0 && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          {comments.map((commentId) => (
            <Comment key={commentId} commentId={commentId} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default React.memo(Comments);

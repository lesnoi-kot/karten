import { useDeferredValue, useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

import { Task } from "models/types";
import Comment from "components/Comment/Comment";

import CommentComposer from "./CommentComposer";

function Comments({ task }: { task: Task }) {
  const { id, comments } = task;

  const latestCommentDateCreated = useDeferredValue(
    useMemo(() => {
      if (comments.length === 0) {
        return new Date();
      }

      let dateCreated = comments[0].dateCreated;

      comments.forEach((c) => {
        if (c.dateCreated > dateCreated) {
          dateCreated = c.dateCreated;
        }
      });

      return dateCreated;
    }, [comments]),
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
        <CommentComposer taskId={id} />
      </Box>

      {comments.length > 0 && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              flash={comment.dateCreated > latestCommentDateCreated}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default Comments;

import { Box, Stack, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

import { Task } from "models/types";

import Comment from "./Comment";
import CommentComposer from "./CommentComposer";

function Comments({ task }: { task: Task }) {
  const { id, comments = [] } = task;

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
            <Comment key={comment.id} comment={comment} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default Comments;

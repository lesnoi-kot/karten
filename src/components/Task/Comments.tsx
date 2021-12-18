import React from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";

import { ID } from "models/types";
import { selectCommentsId } from "app/comments/selectors";

import styles from "./styles.module.css";
import Comment from "./Comment";
import CommentComposer from "./CommentComposer";

type Props = {
  taskId: ID;
};

function Comments({ taskId }: Props) {
  const comments = useSelector((state) => selectCommentsId(state, taskId));

  return (
    <Box>
      <Typography variant="h6" component="h2">
        Comments ({comments.length})
      </Typography>

      <Box mt={1}>
        <CommentComposer taskId={taskId} />
      </Box>

      {comments.length > 0 && (
        <>
          <Box mt={4} />
          <Grid container spacing={3} direction="column">
            {comments.map((commentId) => (
              <Grid item key={commentId}>
                <Comment commentId={commentId} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default React.memo(Comments);

import { useState } from "react";
import { Box, Paper, Typography, Avatar, Button, Stack } from "@mui/material";

import { useComment } from "queries/comments";
import * as models from "models/types";
import Stub from "components/Stub";
import { Markdown } from "components/Markdown";

import CommentEditor from "./CommentEditor";

export default function Comment({ comment }: { comment: models.Comment }) {
  const [editMode, setEditMode] = useState(false);
  const {
    mutation: { mutate: editComment, isLoading },
    deletion: { mutate: deleteComment },
  } = useComment(comment.id);

  if (!comment) {
    return <Stub />;
  }

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
              editComment(text, {
                onSuccess() {
                  setEditMode(false);
                },
              });
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
            <Button
              size="small"
              onClick={() => {
                deleteComment();
              }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
    </Stack>
  );
}

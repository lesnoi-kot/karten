import { useEffect, useState } from "react";
import { Box, Paper, Typography, Avatar, Button, Stack } from "@mui/material";
import format from "date-fns/format";

import { useComment } from "queries/comments";
import { useUser } from "queries/user";
import * as models from "models/types";

import { Markdown } from "components/Markdown";
import Attachments from "components/Attachments";

import CommentEditor from "./CommentEditor";

type Props = {
  comment: models.Comment;
  flash?: boolean;
};

export default function Comment(props: Props) {
  const { flash } = props;
  const [editMode, setEditMode] = useState(false);
  const {
    query: { data: comment },
    mutation: { mutate: editComment, isLoading },
    deletion: { mutate: deleteComment },
    attach: { mutate: attachFiles },
    unattach: { mutate: unattachFiles },
  } = useComment({
    enabled: true,
    initialData: props.comment,
    commentId: props.comment.id,
    taskId: props.comment.taskId,
  });
  const { user } = useUser();
  const [backgroundColor, setBackgroundColor] = useState(
    flash ? "#fffde4" : undefined,
  );

  useEffect(() => {
    if (flash) {
      setBackgroundColor(undefined);
    }
  }, [flash]);

  if (!comment) {
    return null;
  }

  return (
    <Stack
      position="relative"
      direction="row"
      gap={1}
      alignItems="stretch"
      borderRadius="5px"
      sx={{
        transition: (theme) =>
          theme.transitions.create("background-color", {
            duration: 1000,
            delay: 1000,
          }),
        backgroundColor,
      }}
    >
      <Box width="40px" flexShrink="0">
        <Avatar sx={{ position: "sticky", top: (theme) => theme.spacing(2) }}>
          {comment.author?.name?.length
            ? comment.author.name[0].toUpperCase()
            : undefined}
        </Avatar>
      </Box>

      <Box flexGrow="1" maxWidth="calc(100% - 40px)">
        <Stack gap={1} mb={1} direction="row" alignItems="baseline">
          <Typography fontWeight="bold" variant="body1">
            {comment.author?.name}
          </Typography>
          <Typography
            color={(theme) => theme.palette.text.secondary}
            variant="body2"
          >
            {format(comment.dateCreated, "PPP p")}
          </Typography>
        </Stack>

        {editMode ? (
          <CommentEditor
            text={comment.text}
            onClose={() => setEditMode(false)}
            onAttach={(filesId) => {
              attachFiles(filesId);
            }}
            onSubmit={(text) => {
              editComment(text, {
                onSuccess() {
                  setEditMode(false);
                },
              });
            }}
            isLoading={isLoading}
          />
        ) : (
          <Paper variant="outlined" sx={{ padding: 2, background: "inherit" }}>
            <Markdown html={comment.html} />
          </Paper>
        )}

        <Attachments
          deletable={comment.userId === user?.id}
          attachments={comment.attachments}
          onDelete={(fileId) => {
            unattachFiles(fileId);
          }}
        />

        {!editMode && comment.userId === user?.id && (
          <Box mt={1} display="flex" gap={1}>
            <Button
              variant="text"
              size="small"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
            <Button
              variant="text"
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

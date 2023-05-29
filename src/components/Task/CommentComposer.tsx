import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Box, Stack, TextField, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { useAPI } from "context/APIProvider";
import { ID, KartenFile } from "models/types";
import { blurOnEscape } from "utils/events";
import { useFileUploader, useFileUploaderOnPaste } from "queries/files";

import UserAvatar from "components/UserAvatar";
import { useFilePicker } from "components/ui/FileInput/FileInput";
import Attachments from "components/Attachments";
import { useOptimisticTaskMutation } from "queries/tasks";

function CommentComposer({ taskId }: { taskId: ID }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState(new Array<KartenFile>());
  const { mutateAsync: uploadFile } = useFileUploader();
  const api = useAPI();
  const mutateTask = useOptimisticTaskMutation(taskId);

  const {
    FileInput,
    openDialog: openAttachmentDialog,
    clearFile,
  } = useFilePicker();

  const { mutate: addComment, isLoading } = useMutation({
    mutationFn: () =>
      api.addComment({
        taskId,
        text,
        attachments: attachedFiles.map((file) => file.id),
      }),
    onSuccess(newComment) {
      setText("");
      setFocused(false);
      setAttachedFiles([]);

      mutateTask((task) => {
        task.addComment(newComment);
      });
    },
  });

  const { onPaste } = useFileUploaderOnPaste((uploadedFiles) => {
    setAttachedFiles((files) => files.concat(uploadedFiles));
  });

  return (
    <Stack direction="row" gap={1}>
      <UserAvatar />
      <Box flexGrow="1">
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={blurOnEscape}
          multiline
          fullWidth
          size="small"
          margin="none"
          placeholder="Write a comment"
          minRows={focused ? 2 : 0}
          variant="outlined"
          onFocus={() => setFocused(true)}
          InputProps={{
            style: {
              fontSize: "1rem",
            },
          }}
          onPaste={onPaste}
        />

        <Attachments
          attachments={attachedFiles}
          deletable
          onDelete={(fileId) => {
            setAttachedFiles((files) =>
              files.filter((file) => file.id !== fileId),
            );
          }}
        />

        {focused && (
          <Stack mt={1} gap={1} direction="row">
            <LoadingButton
              loading={isLoading}
              onClick={() => {
                addComment();
              }}
              disabled={text.trim() === ""}
              variant="outlined"
            >
              Save
            </LoadingButton>

            <IconButton
              title="Close editor"
              onClick={() => {
                setAttachedFiles([]);
                setText("");
                setFocused(false);
              }}
              size="small"
            >
              <ClearIcon />
            </IconButton>

            <IconButton
              sx={{ marginLeft: "auto" }}
              title="Attach a file"
              onClick={openAttachmentDialog}
              size="small"
            >
              <AttachFileIcon />
            </IconButton>
          </Stack>
        )}

        <FileInput
          buttonProps={{ sx: { display: "none" } }}
          hidden
          multiple
          onChange={(files) => {
            const uploadings = files.map((file) => uploadFile(file));

            Promise.all(uploadings)
              .then((uploadedFiles) => {
                setAttachedFiles((files) => files.concat(uploadedFiles));
              })
              .finally(() => {
                clearFile();
              });
          }}
        />
      </Box>
    </Stack>
  );
}

export default CommentComposer;

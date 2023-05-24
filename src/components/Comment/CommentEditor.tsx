import { useState } from "react";
import { TextField, Stack, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { placeCaretToTheEnd, blurOnEscape } from "utils/events";
import { useFileUploader, useFileUploaderOnPaste } from "queries/files";
import { ID } from "models/types";

import { useFilePicker } from "components/ui/FileInput/FileInput";

type Props = {
  text: string;
  isLoading?: boolean;
  canClose?: boolean;
  onClose(): void;
  onSubmit(newText: string): void;
  onAttach(filesId: ID[]): void;
};

function CommentEditor({
  text,
  onClose,
  onSubmit,
  onAttach,
  isLoading = false,
  canClose = true,
}: Props) {
  const [tempText, setTempText] = useState(text);
  const { mutateAsync: uploadFile } = useFileUploader();
  const {
    FileInput,
    openDialog: openAttachemntDialog,
    clearFile,
  } = useFilePicker();

  const { onPaste } = useFileUploaderOnPaste((files) => {
    onAttach(files.map((file) => file.id));
  });

  return (
    <Stack gap={1}>
      <TextField
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        multiline
        fullWidth
        autoFocus
        onFocus={placeCaretToTheEnd}
        onKeyDown={blurOnEscape}
        margin="dense"
        size="small"
        placeholder="Write a comment"
        variant="outlined"
        minRows={2}
        onPaste={onPaste}
      />

      <Stack gap={1} direction="row">
        <LoadingButton
          loading={isLoading}
          onClick={() => {
            onSubmit(tempText);
          }}
          disabled={text.trim() === ""}
          variant="outlined"
          size="small"
        >
          Save
        </LoadingButton>
        {canClose && (
          <IconButton title="Close editor" onClick={onClose} size="small">
            <ClearIcon />
          </IconButton>
        )}

        <IconButton
          sx={{ marginLeft: "auto" }}
          title="Attach a file"
          onClick={openAttachemntDialog}
          size="small"
        >
          <AttachFileIcon />
        </IconButton>

        <FileInput
          buttonProps={{ sx: { display: "none" } }}
          hidden
          multiple
          onChange={(files) => {
            const uploadings = files.map((file) => uploadFile(file));

            Promise.all(uploadings)
              .then((uploadedFiles) => {
                onAttach(uploadedFiles.map((file) => file.id));
              })
              .finally(() => {
                clearFile();
              });
          }}
        />
      </Stack>
    </Stack>
  );
}

export default CommentEditor;

import React, { useState } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./styles.module.css";

type Props = {
  text: string;
  isLoading?: boolean;
  canClose?: boolean;
  onClose(): void;
  onSubmit(newText: string): void;
};

function CommentEditor({
  text,
  onClose,
  onSubmit,
  isLoading = false,
  canClose = true,
}: Props) {
  const [tempText, setTempText] = useState(text);

  return (
    <Box>
      <TextField
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        multiline
        fullWidth
        autoFocus
        onFocus={(e) =>
          e.target.setSelectionRange(
            e.target.value.length,
            e.target.value.length,
          )
        }
        margin="dense"
        size="small"
        placeholder="Write a comment"
        className={styles.textfield}
        variant="outlined"
      />

      <Box mt={1} display="flex" gap={1}>
        <LoadingButton
          loading={isLoading}
          onClick={() => {
            if (text !== tempText) onSubmit(tempText);
          }}
          disabled={text.trim() === ""}
          variant="outlined"
          size="small"
        >
          Save
        </LoadingButton>
        {canClose && (
          <IconButton onClick={onClose} size="small">
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default CommentEditor;

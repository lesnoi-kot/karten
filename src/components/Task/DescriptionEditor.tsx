import { useEffect, useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  PaperProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotesIcon from "@mui/icons-material/Notes";

import { Task } from "models/types";

import { placeCaretToTheEnd, blurOnEscape } from "utils/events";
import { Markdown } from "components/Markdown";

export type Props = {
  task: Task;
  onChange(newDescription: string): void;
};

const EmptyDescriptionCard = styled(Paper)<PaperProps<"button">>(
  ({ theme }) => ({
    padding: theme.spacing(1),
    paddingBlock: theme.spacing(1.5),
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    backgroundColor: theme.palette.surfaces[50],
    "&:hover": {
      backgroundColor: theme.palette.surfaces[100],
    },
  }),
);

function DescriptionEditor({ task, onChange }: Props) {
  const { text: initialDescription } = task;
  const [readonly, setReadonly] = useState(true);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const onDescriptionChange = () => {
    if (initialDescription !== description) {
      onChange(description);
    }
    setReadonly(true);
  };

  const onCloseEditor = () => {
    setDescription(initialDescription);
    setReadonly(true);
  };

  console.log("rerender");

  return (
    <>
      <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
        <NotesIcon />
        <Typography variant="h6" component="h3">
          Description
        </Typography>
        {readonly && description && (
          <Button
            onClick={() => setReadonly(false)}
            size="small"
            variant="text"
          >
            Edit
          </Button>
        )}
      </Box>
      <Box pl={4} mt={1}>
        {readonly &&
          (description ? (
            <Markdown html={task.html} />
          ) : (
            <EmptyDescriptionCard
              component="button"
              onClick={() => setReadonly(false)}
              elevation={0}
            >
              <Typography variant="body2">
                Add a more detailed description
              </Typography>
            </EmptyDescriptionCard>
          ))}

        {!readonly && (
          <>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              onFocus={placeCaretToTheEnd}
              onKeyDown={blurOnEscape}
              onBlur={() => {
                if (initialDescription === description) {
                  onCloseEditor();
                }
              }}
              fullWidth
              multiline
              margin="dense"
              size="small"
              minRows={3}
              maxRows={15}
              variant="outlined"
              inputProps={{
                resize: "vertical",
              }}
              InputProps={{
                style: {
                  fontSize: "0.9rem",
                },
              }}
            />
            <Box mt={1} display="flex" gap={1}>
              <Button
                onClick={onDescriptionChange}
                variant="contained"
                size="small"
              >
                Save
              </Button>
              <Button onClick={onCloseEditor} variant="text" size="small">
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default DescriptionEditor;

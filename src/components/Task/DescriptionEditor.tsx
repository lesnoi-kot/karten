import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { micromark } from "micromark";

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

import { actions as apiActions } from "app/apiInteraction";
import { Task } from "models/types";

import styles from "./styles.module.css";

export type Props = {
  task: Task;
};

const EmptyDescriptionCard = styled(Paper)<PaperProps>(({ theme }) => ({
  padding: theme.spacing(1),
  paddingBlock: theme.spacing(1.5),
  cursor: "pointer",
  width: "100%",
  component: "button",
  textAlign: "left",
  backgroundColor: theme.palette.surfaces[50],
  "&:hover": {
    backgroundColor: theme.palette.surfaces[100],
  },
}));

function DescriptionEditor({ task }: Props) {
  const dispatch = useDispatch();
  const { id, text: initialDescription } = task;
  const [readonly, setReadonly] = useState(true);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const onDescriptionChange = () => {
    if (initialDescription !== description) {
      dispatch(apiActions.updateTaskRequest({ id, text: description }));
    }
    setReadonly(true);
  };

  const onCloseEditor = () => {
    setDescription(initialDescription);
    setReadonly(true);
  };

  const markdown = useMemo(() => micromark(description), [description]);

  return (
    <>
      <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
        <NotesIcon />
        <Typography variant="h6" component="h2">
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
      {readonly &&
        (description ? (
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: markdown }} />
          </Typography>
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
            fullWidth
            multiline
            margin="dense"
            size="small"
            autoFocus
            onFocus={(e) =>
              e.target.setSelectionRange(
                e.target.value.length,
                e.target.value.length,
              )
            }
            minRows={3}
            variant="outlined"
            className={styles.textfield}
          />
          <Box mt={1} display="flex" gap={0.5}>
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
    </>
  );
}

export default DescriptionEditor;

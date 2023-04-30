import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  SxProps,
  Theme,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Project } from "models/types";

import BoardCoverSelect, { OnChangeArg } from "./BoardCoverSelect";
import { hexColorToNumber } from "utils/color";
import { ENTITY_COLOR } from "models/constants";

type Props = {
  project: Project;
  isOpen: boolean;
  onClose(): void;
};

export default function NewBoardDialog({ project, isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
      <Content project={project} onClose={onClose} />
    </Dialog>
  );
}

const sxDialogContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

type ContentProps = {
  project: Project;
  onClose(): void;
};

function Content({ project, onClose }: ContentProps) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: addBoard, isLoading } = useMutation({
    mutationFn: api.addBoard.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      onClose();
    },
  });

  const [boardName, setBoardName] = useState("");
  const [color, setColor] = useState<string>(ENTITY_COLOR.blue);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [coverURL, setCoverURL] = useState<string | null>(null);

  const onCoverChange = (data: OnChangeArg) => {
    if ("color" in data) {
      setColor(data.color);
      setCoverURL(null);
      setCoverId(null);
    } else {
      setCoverURL(data.coverURL);
      setCoverId(data.coverId);
    }
  };

  return (
    <>
      <DialogTitle>New board in project "{project.name}"</DialogTitle>
      <DialogContent dividers sx={sxDialogContent}>
        <DialogContentText>
          Kanban boards visually depict work at various stages of a process
          using cards to represent work items and columns to represent each
          stage of the process. Cards are moved from left to right to show
          progress and to help coordinate teams performing the work.
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          size="small"
          label="Add board title"
          fullWidth
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          disabled={isLoading}
          required
        />

        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Typography component="h3" fontWeight="bolder" variant="subtitle1">
            Background
          </Typography>

          <BoardCoverSelect
            color={color}
            coverURL={coverURL}
            onChange={onCoverChange}
          />
        </Box>

        <Box display="flex" flexDirection="column" mt={2}>
          <Typography component="h3" fontWeight="bolder" variant="subtitle1">
            Choose template
          </Typography>

          <RadioGroup row name="template" defaultValue="empty">
            <FormControlLabel value="empty" control={<Radio />} label="Empty" />
            <FormControlLabel value="todo" control={<Radio />} label="Kanban" />
          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton
          onClick={() => {
            addBoard({
              projectId: project.id,
              name: boardName,
              coverId,
              color: hexColorToNumber(color),
            });
          }}
          loading={isLoading}
          disabled={boardName.trim() === ""}
        >
          Create board
        </LoadingButton>
      </DialogActions>
    </>
  );
}

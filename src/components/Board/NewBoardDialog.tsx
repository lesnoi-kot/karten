import { keys } from "ramda";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";

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
  Stack,
  SxProps,
  Theme,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { actions } from "app/apiInteraction";
import { colorToNumber } from "models";
import { ENTITY_COLOR } from "models/constants";
import { ID, ColorName } from "models/types";
import { selectProjectById } from "app/projects/selectors";
import { useAPI } from "context/APIProvider";
import { useAppSelector } from "app/hooks";
import { useFilePicker } from "components/ui/FileInput/FileInput";
import { useRequest } from "app/apiInteraction/hooks";

import boardPreviewSVG from "./board_preview.svg";

type Props = {
  projectId: ID;
  isOpen: boolean;
  onClose(): void;
};

const sxDialogContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const sxColorTile: SxProps<Theme> = {
  width: "40px",
  height: "32px",
  cursor: "pointer",
};

export default function NewBoardDialog({ projectId, isOpen, onClose }: Props) {
  const api = useAPI();

  const { data: covers } = useQuery("boards.covers", () =>
    api.getBoardCovers(),
  );

  const { load, isLoading, isLoaded } = useRequest(actions.addBoardRequest);
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );
  const [boardName, setBoardName] = useState("");
  const [color, setColor] = useState<ColorName>("blue");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const { FileInput, clearFile } = useFilePicker();

  const coverURL = useMemo<string | null>(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }

    if (coverId && covers) {
      return covers.find((cover) => cover.id === coverId)?.url ?? null;
    }

    return null;
  }, [covers, coverFile, coverId]);

  const onSubmit = () => {
    load({
      projectId,
      name: boardName,
      cover: coverFile,
      coverId,
      color: colorToNumber(color),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setBoardName("");
      setColor("blue");
      setCoverFile(null);
      clearFile();
      setCoverId(null);
    }
  }, [isOpen, clearFile]);

  useEffect(() => {
    if (isLoaded) {
      onClose();
    }
  }, [onClose, isLoaded]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New board in project "{project?.name}"</DialogTitle>
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

          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" gap={1}>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {keys(ENTITY_COLOR).map((color: ColorName) => (
                  <Box
                    key={color}
                    title={color}
                    onClick={() => {
                      setColor(color);
                      setCoverFile(null);
                      setCoverId(null);
                    }}
                    bgcolor={ENTITY_COLOR[color]}
                    sx={sxColorTile}
                  />
                ))}
              </Stack>
              <Stack direction="row" gap={1}>
                {(covers ?? []).map((cover) => (
                  <Box
                    key={cover.id}
                    width="64px"
                    height="40px"
                    onClick={() => {
                      setCoverId(cover.id);
                      setCoverFile(null);
                    }}
                  >
                    <img width="100%" src={cover.url} alt="Preview" />
                  </Box>
                ))}

                <FileInput
                  label="Select file"
                  buttonProps={{
                    startIcon: <FileUploadIcon />,
                    variant: "outlined",
                    size: "small",
                  }}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(avatars) => {
                    setCoverFile(avatars[0] ?? null);
                    setCoverId(null);
                  }}
                />
              </Stack>
            </Box>

            <Preview color={color} coverURL={coverURL} />
          </Box>
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
          onClick={onSubmit}
          loading={isLoading}
          disabled={boardName.trim() === ""}
        >
          Create board
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function Preview({
  color,
  coverURL,
}: {
  color: ColorName;
  coverURL: string | null;
}) {
  return (
    <Box
      display="flex"
      position="relative"
      width="200px"
      height="120px"
      paddingX={1}
      alignItems="center"
      justifyContent="center"
      margin="0 auto"
      bgcolor={ENTITY_COLOR[color]}
      title="New board preview"
    >
      {coverURL && (
        <Box
          component="img"
          position="absolute"
          width="100%"
          height="100%"
          top="0"
          left="0"
          src={coverURL}
          alt="Preview"
        />
      )}
      <Box
        component="img"
        zIndex="1"
        width="100%"
        src={boardPreviewSVG}
        alt="Preview"
      />
    </Box>
  );
}

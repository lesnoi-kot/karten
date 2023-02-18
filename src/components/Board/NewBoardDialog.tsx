import { keys } from "ramda";
import { useState, useEffect, useMemo, useRef } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ID, ColorName } from "models/types";
import { actions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { useAppDispatch } from "app/hooks";
import { ENTITY_COLOR } from "models/constants";
import FilePicker from "components/ui/FilePicker/FilePicker";

import boardPreviewSVG from "./board_preview.svg";
import { useQuery } from "react-query";
import { useAPI } from "context/APIProvider";
import { colorToNumber } from "models";

type Props = {
  projectId: ID;
  isOpen: boolean;
  onClose(): void;
};

export default function NewBoardDialog({ projectId, isOpen, onClose }: Props) {
  const api = useAPI();

  const { data: covers } = useQuery("boards.covers", () =>
    api.getBoardCovers(),
  );

  const dispatch = useAppDispatch();
  const { load, isLoading, isLoaded } = useRequest(actions.addBoardRequest);
  const [boardName, setBoardName] = useState("");
  const [color, setColor] = useState<ColorName>("blue");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoaded) {
      onClose();
    }
  }, [onClose, isLoaded]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New board</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Kanban boards visually depict work at various stages of a process
          using cards to represent work items and columns to represent each
          stage of the process. Cards are moved from left to right to show
          progress and to help coordinate teams performing the work.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Add board title"
          fullWidth
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          disabled={isLoading}
        />

        <DialogContentText gutterBottom>Background</DialogContentText>

        <Stack direction="row" gap={1}>
          {keys(ENTITY_COLOR).map((color: ColorName) => (
            <Box
              key={color}
              width="40px"
              height="32px"
              bgcolor={ENTITY_COLOR[color]}
              title={color}
              onClick={() => {
                setColor(color);
                setCoverFile(null);
                setCoverId(null);
              }}
            />
          ))}
        </Stack>

        {covers && (
          <Stack direction="row" gap={1}>
            {covers.map((cover) => (
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
          </Stack>
        )}

        <Box>
          <FilePicker
            // ref={fileInputRef}
            caption="Add board cover"
            accept="image/png, image/jpeg, image/webp"
            onChange={(avatars) => {
              setCoverFile(avatars[0] ?? null);
              setCoverId(null);
            }}
          />
        </Box>

        <Preview color={color} coverURL={coverURL} />
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

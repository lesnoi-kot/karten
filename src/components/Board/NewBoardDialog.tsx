import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

import {
  selectIsBoardAdding,
  selectBoardAddRequestState,
} from "app/apiInteraction/selectors";
import { FetchState } from "utils/types";

type Props = {
  isOpen: boolean;
  onClose(): void;
  onAction(name: string): void;
};

export default function NewBoardDialog({ isOpen, onClose, onAction }: Props) {
  const isBoardAdding = useSelector(selectIsBoardAdding);
  const boardAddRequestState = useSelector(selectBoardAddRequestState);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setBoardName("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (boardAddRequestState === FetchState.FULFILLED) {
      onClose();
    }
  }, [onClose, boardAddRequestState]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <span>New board</span>
        {isBoardAdding && (
          <CircularProgress size={20} style={{ float: "right" }} />
        )}
      </DialogTitle>
      <DialogContent>
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
          label="Add board title"
          fullWidth
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          disabled={isBoardAdding}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isBoardAdding}>
          Cancel
        </Button>
        <Button
          onClick={() => onAction(boardName)}
          color="primary"
          disabled={isBoardAdding || boardName.trim() === ""}
        >
          Create board
        </Button>
      </DialogActions>
    </Dialog>
  );
}

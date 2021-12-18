import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import { actions, selectState } from "./slice";

export function ConfirmDialog() {
  const dispatch = useDispatch();
  const {
    isOpen,
    text,
    title,
    okAction,
    okButtonText,
    cancelButtonText,
  } = useSelector(selectState);

  const onClose = () => dispatch(actions.closeDialog());

  const onOK = () => {
    dispatch(okAction);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelButtonText || "Cancel"}
        </Button>
        <Button onClick={onOK} color="primary" autoFocus>
          {okButtonText || "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ConfirmDialog);

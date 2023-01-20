import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import { actions, selectState } from "app/widgets/confirmDialog";
import { useRequestInfoOfAction } from "app/apiInteraction/hooks";

export function ConfirmDialog() {
  const dispatch = useDispatch();
  const { isOpen, text, title, okAction, okButtonText, cancelButtonText } =
    useSelector(selectState);
  const { isLoaded } = useRequestInfoOfAction(okAction);

  const onClose = () => dispatch(actions.closeDialog());

  const onOK = () => {
    if (okAction) {
      dispatch(okAction);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isLoaded) {
      dispatch(actions.closeDialog());
    }
  }, [dispatch, isLoaded]);

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

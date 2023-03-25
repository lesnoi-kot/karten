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
import { LoadingButton } from "@mui/lab";

import { actions, selectState } from "app/widgets/confirmDialog";
import { useRequestInfoOfAction } from "app/apiInteraction/hooks";

export function ConfirmDialog() {
  const dispatch = useDispatch();
  const { isOpen, text, title, okAction, okButtonText, cancelButtonText } =
    useSelector(selectState);
  const { isLoaded, isLoading } = useRequestInfoOfAction(okAction);

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
        <LoadingButton
          onClick={onOK}
          color="primary"
          autoFocus
          loading={isLoading}
        >
          {okButtonText || "OK"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ConfirmDialog);

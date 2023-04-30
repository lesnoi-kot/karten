import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

type Props = {
  isOpen: boolean;
  text: string;
  title?: string;
  cancelButtonText?: string;
  okButtonText?: string;
  isLoading?: boolean;
  onClose?(): void;
  onOK?(): void;
};

export function ConfirmDialog({
  isOpen,
  title,
  text,
  cancelButtonText,
  okButtonText,
  isLoading,
  onClose,
  onOK,
}: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelButtonText}
        </Button>
        <LoadingButton
          onClick={onOK}
          color="primary"
          autoFocus
          loading={isLoading}
        >
          {okButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

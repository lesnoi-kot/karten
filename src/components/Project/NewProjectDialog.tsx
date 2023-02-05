import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { actions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import FilePicker from "components/ui/FilePicker/FilePicker";

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export default function NewProjectDialog({ onClose, isOpen }: Props) {
  const { load, onSuccess, isLoading } = useRequest(actions.addProject);
  const [projectName, setProjectName] = useState("");
  const [projectAvatar, setProjectAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
    }
  }, [isOpen]);

  const onSubmit = () => {
    load({ name: projectName, avatar: projectAvatar });
  };
  onSuccess(onClose);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New project</DialogTitle>
      <DialogContent dividers>
        <DialogContentText gutterBottom>
          A Project is a group of boards. Use it to organize your company, side
          hustle, family, or friends.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Add project title"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isLoading}
        />

        <FilePicker
          caption="Add project logo"
          accept="image/png, image/jpeg, image/webp"
          showPreview
          onChange={(avatars) => setProjectAvatar(avatars[0] ?? null)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          disabled={projectName.trim() === ""}
          onClick={onSubmit}
        >
          Create project
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

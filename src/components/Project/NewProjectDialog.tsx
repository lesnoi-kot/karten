import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

import { actions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export default function NewProjectDialog({ isOpen, onClose }: Props) {
  const { load, onSuccess, isLoading } = useRequest(actions.addProject);
  const [projectName, setProjectName] = useState("");

  const onSubmit = () => {
    load({ name: projectName });
  };
  onSuccess(onClose);

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <span>New project</span>
        <Box flexGrow={1} />
        {isLoading && <CircularProgress size={20} />}
      </DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          disabled={isLoading || projectName.trim() === ""}
        >
          Create project
        </Button>
      </DialogActions>
    </Dialog>
  );
}

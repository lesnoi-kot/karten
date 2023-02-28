import { useMemo, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  SxProps,
  Theme,
  Typography,
  Collapse,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { actions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { useFilePicker } from "components/ui/FileInput/FileInput";

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export default function NewProjectDialog({ onClose, isOpen }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Content onClose={onClose} />
    </Dialog>
  );
}

const sxDialogContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const sxImagePreviewContainer: SxProps<Theme> = {
  width: "100px",
  height: "100px",
};

function Content({ onClose }: Pick<Props, "onClose">) {
  const [projectName, setProjectName] = useState("");
  const [projectAvatar, setProjectAvatar] = useState<File | null>(null);
  const { FileInput, clearFile } = useFilePicker();

  const { load, isLoading } = useRequest(actions.addProject, {
    onSuccess: onClose,
  });

  const onSubmit = () => {
    load({ name: projectName, avatar: projectAvatar });
  };

  const avatarObjectURL = useMemo(() => {
    return projectAvatar ? URL.createObjectURL(projectAvatar) : "";
  }, [projectAvatar]);

  useEffect(() => {
    return () => {
      if (avatarObjectURL) {
        URL.revokeObjectURL(avatarObjectURL);
      }
    };
  }, [avatarObjectURL]);

  return (
    <>
      <DialogTitle>New project</DialogTitle>
      <DialogContent dividers sx={sxDialogContent}>
        <DialogContentText>
          A Project is a group of boards. Use it to organize your company, side
          hustle, family, or friends.
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          size="small"
          label="Add project title"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isLoading}
          required
        />

        <Box mt={2}>
          <Box display="flex" flexDirection="row" gap={1} mb={1}>
            <Typography component="h3" fontWeight="bolder" variant="subtitle1">
              Project logo
            </Typography>

            <FileInput
              accept="image/png, image/jpeg, image/webp"
              hidden
              label="upload"
              buttonProps={{
                startIcon: <FileUploadIcon />,
                variant: "outlined",
                size: "small",
              }}
              onChange={(avatars) => setProjectAvatar(avatars[0] ?? null)}
            />

            {!!projectAvatar && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  clearFile();
                  setProjectAvatar(null);
                }}
              >
                Reset
              </Button>
            )}
          </Box>

          <Collapse in={!!avatarObjectURL}>
            <Avatar
              src={avatarObjectURL}
              variant="rounded"
              alt={projectAvatar?.name}
              title="Selected image for the project logo"
              sx={sxImagePreviewContainer}
            >
              {projectName}
            </Avatar>
          </Collapse>

          {projectAvatar === null && (
            <DialogContentText variant="body2">
              No image selected
            </DialogContentText>
          )}
        </Box>
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
    </>
  );
}

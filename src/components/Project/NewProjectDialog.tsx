import { useState } from "react";
import { useMutation } from "react-query";
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

import { KartenImageFile } from "models/types";
import { UploadImage } from "services/api";
import { actions } from "app/apiInteraction";
import { useAPI } from "context/APIProvider";
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
  const api = useAPI();
  const [projectName, setProjectName] = useState("");
  const [avatar, setAvatar] = useState<KartenImageFile | null>(null);
  const { FileInput, clearFile } = useFilePicker();

  const { load, isLoading } = useRequest(actions.addProject, {
    onSuccess: onClose,
  });

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation({
    mutationFn: (arg: UploadImage) => api.uploadImage(arg),
    onSuccess: (uploadedImage) => {
      setAvatar(uploadedImage);
    },
  });

  const onSubmit = () => {
    load({ name: projectName, avatarId: avatar?.id });
  };

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
                loading: isUploadingImage,
              }}
              onChange={(avatars) => {
                if (avatars[0]) {
                  uploadImage({ file: avatars[0], makeThumbnail: true });
                }
              }}
            />

            {!!avatar && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  clearFile();
                  setAvatar(null);
                }}
              >
                Reset
              </Button>
            )}
          </Box>

          <Collapse in={!!avatar}>
            <Avatar
              src={avatar?.thumbnails?.[0]?.url ?? ""}
              variant="rounded"
              alt="Project avatar"
              title="Selected image for the project logo"
              sx={sxImagePreviewContainer}
            >
              {projectName}
            </Avatar>
          </Collapse>

          {avatar === null && (
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

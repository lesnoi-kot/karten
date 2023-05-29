import {
  Box,
  IconButton,
  Modal,
  ModalProps,
  CircularProgress,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { ID } from "models/types";

import Task from "./Task";
import { useState } from "react";

type TaskModalProps = {
  taskId: ID | null;
  onClose(): void;
};

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  overflow: "scroll",
}));

export function TaskModal({ onClose, taskId }: TaskModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <StyledModal
      open={!!taskId}
      disableScrollLock
      onClose={onClose}
      sx={{
        maxWidth: isFullscreen ? "100%" : undefined,
        padding: isFullscreen ? 0 : undefined,
        margin: isFullscreen ? 0 : undefined,
      }}
    >
      {taskId ? (
        <Container
          fixed
          maxWidth={isFullscreen ? false : "lg"}
          disableGutters
          sx={{
            position: "relative",
            width: isFullscreen ? "100%" : undefined,
            maxWidth: isFullscreen ? "100% !important" : undefined,
          }}
        >
          <Box position="absolute" mt={1} mr={1} right={0} zIndex={1}>
            <IconButton
              size="small"
              onClick={() => {
                setIsFullscreen((value) => !value);
              }}
              title={
                isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"
              }
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>

            <IconButton size="small" onClick={onClose} title="Close task modal">
              <ClearIcon />
            </IconButton>
          </Box>

          <Task taskId={taskId} onDelete={onClose} />
        </Container>
      ) : (
        <CircularProgress />
      )}
    </StyledModal>
  );
}

export default TaskModal;

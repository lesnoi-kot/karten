import {
  Box,
  IconButton,
  Modal,
  ModalProps,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";

import { ID } from "models/types";

import Task from "./Task";

type TaskModalProps = {
  taskId: ID | null;
  onClose(): void;
};

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  maxWidth: "768px",
  height: "auto",
  minHeight: "500px",
  maxHeight: "100%",
  overflow: "scroll",
}));

export function TaskModal({ onClose, taskId }: TaskModalProps) {
  return (
    <StyledModal open={!!taskId} disableScrollLock onClose={onClose}>
      {taskId ? (
        <Box position="relative">
          <Box position="absolute" mt={1} mr={1} right={0} zIndex={1}>
            <IconButton size="small" onClick={onClose}>
              <ClearIcon />
            </IconButton>
          </Box>

          <Task taskId={taskId} onDelete={onClose} />
        </Box>
      ) : (
        <CircularProgress />
      )}
    </StyledModal>
  );
}

export default TaskModal;

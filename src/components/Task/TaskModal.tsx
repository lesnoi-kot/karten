import { Box, IconButton, Modal, ModalProps } from "@mui/material";
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
      <Box>
        <Box position="absolute" mt={1} mr={1} right={0}>
          <IconButton size="small" onClick={onClose}>
            <ClearIcon />
          </IconButton>
        </Box>
        {taskId && <Task taskId={taskId} />}
      </Box>
    </StyledModal>
  );
}

export default TaskModal;

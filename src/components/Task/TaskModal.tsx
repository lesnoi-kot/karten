import { Box, IconButton, Modal, ModalProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";

import Task, { Props } from "./Task";

type TaskModalProps = Props & {
  onClose(): void;
};

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  marginLeft: "auto",
  marginRight: "auto",
  height: "auto",
  maxWidth: "768px",
  width: "100%",
  minHeight: "500px",
  maxHeight: "100%",
}));

export function TaskModal({ onClose, ...taskProps }: TaskModalProps) {
  return (
    <StyledModal open onClose={onClose}>
      <>
        <Box position="absolute" mt={1} mr={1} right={0}>
          <IconButton size="small" onClick={onClose}>
            <ClearIcon />
          </IconButton>
        </Box>
        <Task {...taskProps} />
      </>
    </StyledModal>
  );
}

export default TaskModal;

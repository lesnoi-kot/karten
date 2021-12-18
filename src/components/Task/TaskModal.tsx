import React from "react";
import { IconButton, Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./styles.module.css";
import Task, { Props } from "./Task";

type TaskModalProps = Props & {
  onClose(): void;
};

export function TaskModal({ onClose, ...props }: TaskModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      disableAutoFocus
      className={styles.modalWrapper}
    >
      <>
        <IconButton
          size="small"
          className={styles.modalClose}
          onClick={onClose}
        >
          <ClearIcon />
        </IconButton>
        <Task {...props} />
      </>
    </Modal>
  );
}

export default TaskModal;

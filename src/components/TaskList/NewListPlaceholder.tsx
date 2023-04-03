import { useState, useRef, KeyboardEventHandler } from "react";
import cx from "classnames";

import { Box, TextField, Collapse } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

import { ID } from "models/types";
import { useRequest } from "app/apiInteraction/hooks";
import { actions } from "app/apiInteraction";

import ListSection from "./ListSection";
import styles from "./styles.module.css";

function NewListPlaceholder({ boardId }: { boardId: ID }) {
  const [isFieldVisible, setFieldVisible] = useState(false);
  const [taskListName, setTaskListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openField = () => {
    setTaskListName("");
    setFieldVisible(true);

    setTimeout(() => {
      inputRef.current?.focus();
      document.getElementById("scrollable_space")?.scroll({
        top: 0,
        left: 1e9,
        behavior: "smooth",
      });
    }, 100);
  };

  const closeField = () => {
    setFieldVisible(false);
    setTaskListName("");
  };

  const { load, isLoading } = useRequest(actions.addTaskListRequest, {
    onSuccess() {
      openField();
    },
  });

  const submit = () => {
    if (taskListName) {
      load({ boardId, name: taskListName });
    } else {
      closeField();
    }
  };

  const onClick = () => {
    if (isFieldVisible) {
      submit();
    } else {
      openField();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "Escape") {
      closeField();
    }
  };

  const onBlur = () => {
    if (!taskListName.trim()) {
      closeField();
    }
  };

  return (
    <Box px={2} className={cx(styles.list, styles.newList)}>
      <ListSection mb={0}>
        <Collapse in={isFieldVisible}>
          <Box mt={1}>
            <TextField
              margin="dense"
              size="small"
              id="name"
              inputRef={inputRef}
              fullWidth
              label="Add new list"
              value={taskListName}
              onBlur={onBlur}
              onChange={(e) => setTaskListName(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
          </Box>
        </Collapse>
        <LoadingButton
          variant="outlined"
          color="primary"
          size="small"
          loading={isLoading}
          startIcon={<AddIcon />}
          disabled={isFieldVisible && !taskListName}
          onClick={onClick}
          fullWidth
        >
          {isFieldVisible ? "Add" : "Add new list"}
        </LoadingButton>
      </ListSection>
    </Box>
  );
}

export default NewListPlaceholder;

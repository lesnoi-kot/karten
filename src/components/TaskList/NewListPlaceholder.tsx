import { useState, useRef, KeyboardEventHandler } from "react";
import cx from "classnames";

import { Box, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

import { ID } from "models/types";
import { useRequest } from "app/apiInteraction/hooks";
import { actions } from "app/apiInteraction";

import ListSection from "./ListSection";
import styles from "./styles.module.css";

function NewListPlaceholder({ boardId }: { boardId: ID }) {
  const { load, onSuccess, isLoading } = useRequest(actions.addTaskListRequest);
  const [isFieldVisible, setFieldVisible] = useState(false);
  const [taskListName, setTaskListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openField = () => {
    setTaskListName("");
    setFieldVisible(true);
    inputRef.current?.focus();
  };

  const closeField = () => {
    setFieldVisible(false);
    setTaskListName("");
  };

  onSuccess(closeField);

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
    <Box py={1} px={2} className={cx(styles.list, styles.newList)}>
      <ListSection paddingLeft={1} justifyItems="center">
        {isFieldVisible && (
          <>
            <TextField
              autoFocus
              margin="dense"
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
            <Box mt={2} />
          </>
        )}
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

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import cx from "classnames";

import { Box, Button, TextField, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { ID } from "models/types";
import { FetchState } from "utils/types";
import { actions, selectors } from "app/apiInteraction";

import ListSection from "./ListSection";
import styles from "./styles.module.css";

type Props = {
  boardId: ID;
};

function NewListPlaceholder({ boardId }: Props) {
  const dispatch = useDispatch();
  const requestState = useSelector(selectors.selectTaskListAddRequestState);
  const [isFieldVisible, setFieldVisible] = useState(false);
  const [taskListName, setTaskListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (requestState === FetchState.FULFILLED) {
      openField();
    }
  }, [requestState]);

  const openField = () => {
    setTaskListName("");
    setFieldVisible(true);
    inputRef.current?.focus();
  };

  const closeField = () => {
    setFieldVisible(false);
    setTaskListName("");
  };

  const submit = debounce(() => {
    if (taskListName) {
      dispatch(actions.addTaskListRequest({ boardId, name: taskListName }));
    } else {
      closeField();
    }
  }, 100);

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
              label="Add list name"
              value={taskListName}
              onBlur={submit}
              onChange={(e) => setTaskListName(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
            <Box mt={2} />
          </>
        )}
        <Button
          variant="outlined"
          color="primary"
          startIcon={
            requestState === FetchState.PENDING ? (
              <CircularProgress size={15} />
            ) : (
              <AddIcon />
            )
          }
          disabled={isFieldVisible && !taskListName}
          onClick={onClick}
          fullWidth
        >
          Add another list
        </Button>
      </ListSection>
    </Box>
  );
}

export default NewListPlaceholder;

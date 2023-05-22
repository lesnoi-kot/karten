import { useState, useRef, KeyboardEventHandler } from "react";
import { useMutation } from "@tanstack/react-query";
import { styled } from "@mui/material/styles";
import { Box, TextField, Collapse, Card, CardProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

import { useAPI } from "context/APIProvider";
import { ID } from "models/types";
import { useOptimisticBoardMutation } from "queries/boards";
import { useScrollableSpace } from "components/ScrollableSpace";

const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  padding: theme.spacing(1),
  marginLeft: theme.spacing(1),
  width: "250px",
  minWidth: "250px",
  maxWidth: "250px",
  backgroundColor: theme.palette.surfaces[50],
}));

function NewListPlaceholder({ boardId }: { boardId: ID }) {
  const api = useAPI();
  const [isFieldVisible, setFieldVisible] = useState(false);
  const [taskListName, setTaskListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { scrollToRight } = useScrollableSpace();
  const updateBoard = useOptimisticBoardMutation();

  const openField = () => {
    setTaskListName("");
    setFieldVisible(true);

    setTimeout(() => {
      inputRef.current?.focus();
      scrollToRight();
    }, 100);
  };

  const closeField = () => {
    setFieldVisible(false);
    setTaskListName("");
  };

  const { mutate: addTaskList, isLoading } = useMutation({
    mutationFn: () =>
      api.addTaskList({ boardId, name: taskListName, position: Date.now() }),
    onSuccess: (newTaskList) => {
      updateBoard((draft) => {
        draft.addTaskList(newTaskList);
      });

      openField();
    },
  });

  const submit = () => {
    if (taskListName) {
      addTaskList();
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
    <StyledCard>
      <Collapse in={isFieldVisible} mountOnEnter>
        <Box paddingX={0.5}>
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
            variant="standard"
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
        sx={{
          marginTop: isFieldVisible ? 1 : 0,
        }}
      >
        {isFieldVisible ? "Add" : "Add new list"}
      </LoadingButton>
    </StyledCard>
  );
}

export default NewListPlaceholder;

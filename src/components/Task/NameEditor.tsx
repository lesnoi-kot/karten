import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Box, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";

import { actions as apiActions } from "app/apiInteraction";
import { Task } from "models/types";
import EditableText, {
  Props as EditableTextProps,
} from "components/EditableTextField";

export type Props = {
  task: Task;
};

const StyledEditableText = styled(EditableText)<EditableTextProps>(
  ({ theme }) => ({
    ...theme.typography.h6,
  }),
);

function NameEditor({ task }: Props) {
  const { id: taskId, name } = task;
  const dispatch = useDispatch();

  const onNameChange = useCallback(
    (newName: string) => {
      if (name !== newName) {
        dispatch(apiActions.updateTaskRequest({ id: taskId, name: newName }));
      }
    },
    [taskId, dispatch, name],
  );

  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <ListAltIcon />
      <StyledEditableText
        value={name}
        onChange={onNameChange}
        endAdornment={
          <InputAdornment position="end" disablePointerEvents variant="filled">
            <EditIcon fontSize="small" />
          </InputAdornment>
        }
      />
    </Box>
  );
}

export default NameEditor;

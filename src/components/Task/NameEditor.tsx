import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box } from "@mui/material";

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
      <StyledEditableText value={name} onChange={onNameChange} />
    </Box>
  );
}

export default NameEditor;

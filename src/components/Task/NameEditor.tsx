import { useCallback } from "react";
import { Box, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";

import { Task } from "models/types";
import EditableText, {
  Props as EditableTextProps,
} from "components/EditableTextField";

export type Props = {
  task: Task;
  onChange(newName: string): void;
};

const StyledEditableText = styled(EditableText)<EditableTextProps>(
  ({ theme }) => ({
    ...theme.typography.h6,
  }),
);

function NameEditor({ task, onChange }: Props) {
  const { name } = task;

  const onNameChange = useCallback(
    (newName: string) => {
      if (name !== newName) {
        onChange(newName);
      }
    },
    [name],
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

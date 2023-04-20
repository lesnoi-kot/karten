import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import EditableTextField, {
  Props as EditableTextFieldProps,
} from "components/EditableTextField";

const sxTextField = {
  "&:hover .MuiInputAdornment-root": {
    visibility: "visible",
  },
  "& input:focus + .MuiInputAdornment-root": {
    visibility: "visible",
  },
  "& .MuiInputAdornment-root": {
    visibility: "hidden",
  },
  "& input": {
    fontSize: "2.5rem",
  },
};

export function EditablePageTitle({ sx, ...props }: EditableTextFieldProps) {
  return (
    <EditableTextField
      sx={[sxTextField, ...(Array.isArray(sx) ? sx : [sx])]}
      endAdornment={
        <InputAdornment position="end" disablePointerEvents variant="filled">
          <EditIcon htmlColor="white" />
        </InputAdornment>
      }
      inputProps={{
        maxLength: 32,
      }}
      {...props}
    />
  );
}

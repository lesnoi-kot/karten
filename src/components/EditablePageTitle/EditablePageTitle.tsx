import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import EditableTextField from "components/EditableTextField";

type Props = {
  value: string;
  onChange: (name: string) => void;
};

const sxTextField = {
  textAlign: "center",
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
    textAlign: "center",
    fontSize: "2.5rem",
  },
};

export function EditablePageTitle({ value, onChange }: Props) {
  return (
    <EditableTextField
      title="Click to change name"
      value={value}
      onChange={onChange}
      onFocus={(e) => e.target.setSelectionRange(value.length, value.length)}
      endAdornment={
        <InputAdornment position="end">
          <EditIcon />
        </InputAdornment>
      }
      sx={sxTextField}
    />
  );
}

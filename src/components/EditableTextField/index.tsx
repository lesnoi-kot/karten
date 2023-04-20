import {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  ChangeEventHandler,
} from "react";
import Input, { InputProps } from "@mui/material/Input";
import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { placeCaretToTheEnd } from "utils/events";

export type Props = Omit<InputProps, "onChange"> & {
  value: string;
  disableSubmitOnEnter?: boolean;
  onChange(newValue: string): void;
};

const sxHoverAdornment = {
  "&:hover .MuiInputAdornment-root": {
    visibility: "visible",
  },
  "& input:focus + .MuiInputAdornment-root": {
    visibility: "visible",
  },
  "& .MuiInputAdornment-root": {
    visibility: "hidden",
  },
};

export default function EditableText({
  value,
  onChange,
  disableSubmitOnEnter = false,
  sx = {},
  ...props
}: Props) {
  const [draftValue, setDraftValue] = useState(value);
  const [isEditMode, setEditMode] = useState(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const onBlur = () => {
    if (draftValue !== value) {
      onChange(draftValue);
    }
    setEditMode(false);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") {
      textFieldRef.current?.blur();
      e.stopPropagation();
    } else if (!disableSubmitOnEnter && e.key === "Enter") {
      textFieldRef.current?.blur();
    }
  };

  const onDraftChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setDraftValue(e.target.value);

  const onClick = () => {
    setEditMode(true);
    textFieldRef.current?.focus();
  };

  return (
    <Input
      type="text"
      margin="dense"
      title="Click to change value"
      readOnly={!isEditMode}
      disableUnderline={!isEditMode}
      endAdornment={
        <InputAdornment position="end" disablePointerEvents variant="filled">
          <EditIcon />
        </InputAdornment>
      }
      {...props}
      inputRef={textFieldRef}
      value={draftValue}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={placeCaretToTheEnd}
      onChange={onDraftChange}
      onKeyDown={onKeyDown}
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          cursor: isEditMode ? "initial" : "pointer",
          "& input": {
            cursor: "inherit",
          },
        },
        sxHoverAdornment,
      ]}
    />
  );
}

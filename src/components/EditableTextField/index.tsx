import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  ChangeEventHandler,
} from "react";
import { mergeDeepLeft } from "ramda";
import Input, { InputProps } from "@mui/material/Input";
import clsx from "clsx";

import styles from "./styles.module.css";

type Props = Omit<InputProps, "onChange"> & {
  value: string;
  disableSubmitOnEnter?: boolean;
  onChange(newValue: string): void;
};

export function EditableText({
  value,
  onChange,
  className,
  disableSubmitOnEnter = false,
  inputProps = {},
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
      value={draftValue}
      onBlur={onBlur}
      onChange={onDraftChange}
      onKeyDown={onKeyDown}
      readOnly={!isEditMode}
      disableUnderline={isEditMode ? false : true}
      className={clsx(styles.editableTextField, className)}
      inputProps={mergeDeepLeft(inputProps, {
        style: {
          cursor: isEditMode ? "initial" : "pointer",
        },
      })}
      inputRef={textFieldRef}
      onClick={onClick}
      margin="dense"
      {...props}
    />
  );
}

export default EditableText;

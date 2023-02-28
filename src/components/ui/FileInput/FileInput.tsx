import { useId, useRef, useCallback, HTMLProps } from "react";
import prettyBytes from "pretty-bytes";
import { Button, Box, ButtonProps } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export function FilesPreview({ files }: { files: File[] }) {
  return (
    <Box>
      {files.length > 0 && (
        <List>
          {files.map((file) => (
            <ListItem key={file.name}>
              <ListItemIcon>
                <AttachFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={prettyBytes(file.size)}
              />
              {file.type.startsWith("image/") && (
                <Box
                  component="img"
                  maxWidth="100px"
                  src={URL.createObjectURL(file)}
                  alt={`Selected file: ${file.name}`}
                  title={`Selected file: ${file.name}`}
                />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

type Props = {
  label?: string;
  buttonProps: Partial<ButtonProps<"label">>;
  onChange: (files: File[]) => void;
} & Omit<HTMLProps<HTMLInputElement>, "onChange">;

export function useFilePicker() {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);

  const clearFile = useCallback(() => {
    if (ref.current) {
      ref.current.value = "";
      ref.current.files = null;
    }
  }, []);

  const openDialog = useCallback(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, []);

  const FileInput = useCallback(
    ({ label, buttonProps, onChange, ...props }: Props) => (
      <Button component="label" htmlFor={id} {...buttonProps}>
        {label ?? ""}
        <input
          id={id}
          hidden
          {...props}
          ref={ref}
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              const files = [...e.target.files];
              onChange(files);
            }
          }}
        />
      </Button>
    ),
    [id],
  );

  return { ref, clearFile, openDialog, FileInput };
}

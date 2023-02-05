import { useId, useRef, useState } from "react";
import prettyBytes from "pretty-bytes";
import { Button, Box } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type Props = {
  caption: string;
  accept: string;
  multiple?: boolean;
  showPreview?: boolean;
  onChange: (files: File[]) => void;
};

export default function FilePicker({
  accept,
  multiple,
  caption,
  onChange,
  showPreview,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const id = useId();

  const onClick = () => {
    fileInput.current?.click();
  };

  return (
    <Box>
      <input
        ref={fileInput}
        accept={accept}
        name={id}
        id={id}
        type="file"
        hidden
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) {
            const files = [...e.target.files];
            setFiles(files);
            onChange(files);
          }
        }}
      />

      <label htmlFor={id}>
        <Button startIcon={<AttachFileIcon />} onClick={onClick}>
          {caption}
        </Button>
      </label>

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
              {showPreview && file.type.startsWith("image/") && (
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

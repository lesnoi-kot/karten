import { useRef, useState } from "react";
import { Paper, Typography } from "@mui/material";

import { useTask } from "queries/tasks";
import * as models from "models/types";
import { useFileUploader } from "queries/files";

type Props = {
  taskId: models.ID;
  children: React.ReactNode;
};

const sxDropZonePlaceholder = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
};

export default function TaskDropZone({ taskId, children }: Props) {
  const dragHoverCounter = useRef<number>(0);
  const [dropZoneVisible, setDropZoneVisible] = useState(false);
  const { mutateAsync: uploadFile } = useFileUploader();
  const {
    attach: { mutate: attachFile },
    invalidate,
  } = useTask(taskId);

  return (
    <Paper
      sx={{ position: "relative", paddingX: 2, paddingY: 2 }}
      onDrop={(e) => {
        e.preventDefault();

        const files = Promise.all(
          Array.from(e.dataTransfer.files).map((file) => uploadFile(file)),
        );

        function onSuccess() {
          setDropZoneVisible(false);
          dragHoverCounter.current = 0;
          invalidate();
        }

        files
          .then((kartenFiles) => {
            kartenFiles.forEach((kartenFile) => {
              attachFile(kartenFile.id, {
                onSuccess,
                onSettled() {
                  onSuccess();
                },
              });
            });
          })
          .catch((error) => {});
      }}
      onDragEnter={(e) => {
        e.preventDefault();

        dragHoverCounter.current++;
        setDropZoneVisible(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();

        if (--dragHoverCounter.current === 0) {
          setDropZoneVisible(false);
        }
      }}
    >
      {dropZoneVisible && (
        <Paper sx={sxDropZonePlaceholder}>
          <Typography
            variant="h5"
            component="p"
            p={2}
            border="2px dashed gray"
            mt={2}
          >
            Drop files to upload
          </Typography>
        </Paper>
      )}

      {children}
    </Paper>
  );
}

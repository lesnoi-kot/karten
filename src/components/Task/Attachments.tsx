import { Box, Stack, Typography } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";

import { ID, KartenFile } from "models/types";
import { useTask } from "queries/tasks";
import { useFileDeleter } from "queries/files";

import Attachments from "components/Attachments";
import { useUser } from "queries/user";

type Props = {
  taskId: ID;
  attachments: KartenFile[];
};

export default function TaskAttachments({ taskId, attachments }: Props) {
  const {
    query: { data: task },
    invalidate,
  } = useTask(taskId, { queryEnabled: false });
  const { mutate: deleteFile } = useFileDeleter();
  const { user } = useUser();

  if (attachments.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack alignItems="center" flexDirection="row" gap={1}>
        <AttachmentIcon />
        <Typography variant="h6" component="h2">
          Attachments
        </Typography>
      </Stack>
      <Attachments
        deletable={task?.userId === user?.id}
        attachments={attachments}
        onDelete={(fileId) => {
          deleteFile(fileId, {
            onSuccess() {
              invalidate();
            },
          });
        }}
      />
    </Box>
  );
}

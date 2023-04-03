import React from "react";
import { Box, Paper, Stack, Button, Typography } from "@mui/material";

import { ID } from "models/types";
import Stub from "components/Stub";

import { useTask } from "./hooks";
import styles from "./styles.module.css";
import Comments from "./Comments";
import DescriptionEditor from "./DescriptionEditor";
import NameEditor from "./NameEditor";

export type Props = {
  taskId: ID;
};

function Task({ taskId }: Props) {
  const { task } = useTask(taskId);

  if (!task) {
    return <Stub />;
  }

  return (
    <Paper className={styles.taskCard} sx={{ paddingX: 2, paddingY: 2 }}>
      <Box>
        <NameEditor task={task} />
      </Box>
      <Stack direction="row" gap={2} mt={2}>
        <Box flexGrow={1}>
          <Box>
            <DescriptionEditor task={task} />
          </Box>
          <Box mt={4}>
            <Comments taskId={taskId} />
          </Box>
        </Box>
        <Box flexBasis="20%">
          <SidePanel taskId={taskId} />
        </Box>
      </Stack>
    </Paper>
  );
}

function SidePanel({ taskId }: Props) {
  const onDelete = () => {};
  const onCopy = () => {};

  return (
    <Stack gap={2}>
      <Box>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Add to card
        </Typography>
        <Stack paddingX={1} gap={1}>
          <Button size="small" variant="outlined" onClick={onDelete}>
            Labels
          </Button>
          <Button size="small" variant="outlined" onClick={onCopy}>
            Attachment
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Actions
        </Typography>
        <Stack paddingX={1} gap={1}>
          <Button size="small" variant="outlined" onClick={onDelete}>
            Delete
          </Button>
          <Button size="small" variant="outlined" onClick={onCopy}>
            Copy
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default React.memo(Task);

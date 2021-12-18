import React from "react";
import { Box, Paper } from "@mui/material";

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
    <Paper className={styles.taskCard}>
      <Box padding={2} pl={3}>
        <Box>
          <NameEditor task={task} />
        </Box>
        <Box mt={2}>
          <DescriptionEditor task={task} />
        </Box>
        <Box mt={4}>
          <Comments taskId={taskId} />
        </Box>
      </Box>
    </Paper>
  );
}

export default React.memo(Task);

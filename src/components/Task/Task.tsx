import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

import { ID } from "models/types";
import Stub from "components/Stub";
import { useRequest } from "app/apiInteraction/hooks";
import { actions as apiActions } from "app/apiInteraction";

import { useTask } from "./hooks";
import Comments from "./Comments";
import DescriptionEditor from "./DescriptionEditor";
import NameEditor from "./NameEditor";

export type Props = {
  taskId: ID;
};

function Task({ taskId }: Props) {
  const { task } = useTask(taskId);
  const { load: loadTask, isLoading } = useRequest(apiActions.getTask);

  useEffect(() => {
    loadTask(taskId);
  }, []);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return <Stub />;
  }

  return (
    <Paper sx={{ paddingX: 2, paddingY: 2 }}>
      <Box>
        <NameEditor task={task} />
      </Box>
      <Stack direction="row" gap={2} mt={2}>
        <Box flexGrow="1" maxWidth="70%">
          <Box>
            <DescriptionEditor task={task} />
          </Box>
          <Box mt={4}>
            <Comments taskId={taskId} />
          </Box>
        </Box>
        <Box flexShrink="0" flexBasis="20%">
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
    <Stack gap={2} sx={{ position: "sticky", top: "32px" }}>
      <List dense subheader={<ListSubheader>Add to card</ListSubheader>}>
        <ListItemButton onClick={() => {}}>
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Labels" />
        </ListItemButton>
        <ListItemButton onClick={() => {}}>
          <ListItemIcon>
            <AttachmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Attachment" />
        </ListItemButton>
      </List>

      <List dense subheader={<ListSubheader>Actions</ListSubheader>}>
        <ListItemButton onClick={() => {}}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </ListItemButton>
        <ListItemButton onClick={() => {}}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItemButton>
      </List>
    </Stack>
  );
}

export default React.memo(Task);

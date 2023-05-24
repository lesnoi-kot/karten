import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopIcon from "@mui/icons-material/Stop";

import { useCurrentBoardId } from "context/CurrentBoardProvider";
import { useBoardMethods } from "pages/Board/hooks";
import { useTask } from "queries/tasks";
import * as models from "models/types";
import { boardKeys } from "queries/boards";
import { useFileUploader } from "queries/files";

import { useFilePicker } from "components/ui/FileInput/FileInput";
import ErrorSplash from "components/ui/ErrorSplash";
import { LabelsDialog } from "components/LabelsDialog/LabelsDialog";

import Comments from "./Comments";
import DescriptionEditor from "./DescriptionEditor";
import NameEditor from "./NameEditor";
import Attachments from "./Attachments";
import Labels from "./Labels";
import TaskDropZone from "./TaskDropZone";

export type Props = {
  taskId: models.ID;
  onDelete(): void;
};

function Task({ taskId, onDelete }: Props) {
  const {
    query: { data: task, isLoading },
    mutation: { mutate: editTask },
  } = useTask(taskId);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return <ErrorSplash title="404" message="Project not found" />;
  }

  return (
    <TaskDropZone taskId={taskId}>
      <Box>
        <NameEditor
          task={task}
          onChange={(name: string) => {
            editTask({ name });
          }}
        />
      </Box>
      <Stack direction="row" gap={2} mt={2}>
        <Stack flexGrow="1" maxWidth="70%" gap={2}>
          <Labels task={task} />

          <DescriptionEditor
            task={task}
            onChange={(text: string) => {
              editTask({ text });
            }}
          />

          <Attachments taskId={taskId} attachments={task.attachments} />

          <Box mt={2}>
            <Comments task={task} />
          </Box>
        </Stack>
        <Box flexShrink="0" flexBasis="20%">
          <SidePanel taskId={taskId} onDelete={onDelete} />
        </Box>
      </Stack>
    </TaskDropZone>
  );
}

function SidePanel({ taskId, onDelete }: Props) {
  const queryClient = useQueryClient();
  const boardId = useCurrentBoardId()!;
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const labelsButtonRef = useRef(null);
  const { onTaskClick } = useBoardMethods(boardId);
  const {
    FileInput,
    openDialog: openAttachemntDialog,
    clearFile,
  } = useFilePicker();
  const { mutate: uploadFile } = useFileUploader();

  const {
    deletion: { mutate: deleteTask },
    copy: { mutate: copyTask },
    attach: { mutate: attachFile },
    invalidate,
  } = useTask(taskId);

  return (
    <Stack gap={2} sx={{ position: "sticky", top: "32px" }}>
      <List dense subheader={<ListSubheader>Add to card</ListSubheader>}>
        <ListItemButton
          ref={labelsButtonRef}
          onClick={() => {
            setLabelsDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Labels" />
        </ListItemButton>

        <ListItemButton onClick={openAttachemntDialog}>
          <FileInput
            buttonProps={{ sx: { display: "none" } }}
            hidden
            onChange={(attachment) => {
              uploadFile(attachment[0], {
                onSuccess(uploadedFile) {
                  attachFile(uploadedFile.id, {
                    onSuccess() {
                      invalidate();
                    },
                  });
                },
                onSettled() {
                  clearFile();
                },
              });
            }}
          />
          <ListItemIcon>
            <AttachmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Attachment" />
        </ListItemButton>
      </List>

      <List dense subheader={<ListSubheader>Actions</ListSubheader>}>
        <ListItemButton
          onClick={() => {
            copyTask(undefined, {
              onSuccess(copiedTask) {
                queryClient.invalidateQueries({
                  queryKey: boardKeys.board(boardId),
                });
                onTaskClick(copiedTask.id);
              },
            });
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            deleteTask();
            onDelete();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItemButton>
      </List>

      <TimeTrackSection taskId={taskId} />

      <LabelsDialog
        taskId={taskId}
        open={labelsDialogOpen}
        anchorEl={labelsButtonRef.current}
        onClose={() => {
          setLabelsDialogOpen(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
    </Stack>
  );
}

function TimeTrackSection({ taskId }: { taskId: models.ID }) {
  const {
    query: { data: task },
    startTracking: { mutate: startTracking },
    stopTracking: { mutate: stopTracking },
  } = useTask(taskId);
  const [spentTimeMs, setSpentTimeMs] = useState(computeTrackedTime(task));

  useEffect(() => {
    if (!task?.dateStartedTracking) {
      return;
    }

    const timerId = setInterval(() => {
      setSpentTimeMs(computeTrackedTime(task));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [task]);

  if (!task) {
    return null;
  }

  return (
    <List dense subheader={<ListSubheader>Tracking</ListSubheader>}>
      <ListItem>
        <ListItemIcon>
          <AccessTimeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Time spent"
          secondary={getElapsedClockTimeString(spentTimeMs)}
        />
      </ListItem>
      <ListItemButton
        onClick={() => {
          if (task.dateStartedTracking) {
            stopTracking();
          } else {
            startTracking();
          }
        }}
      >
        <ListItemIcon>
          {task.dateStartedTracking ? (
            <StopIcon fontSize="small" />
          ) : (
            <PlayCircleOutlineIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText primary={task.dateStartedTracking ? "Stop" : "Start"} />
      </ListItemButton>
    </List>
  );
}

function computeTrackedTime(task: models.Task | null | undefined) {
  if (!task) {
    return 0;
  }

  return (
    task.spentTime * 1000 +
    (task.dateStartedTracking
      ? Date.now() - task.dateStartedTracking.getTime()
      : 0)
  );
}

function getElapsedClockTime(ms: number): [number, number, number] {
  let seconds = Math.floor(ms / 1000);

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return [hours, minutes, seconds];
}

function getElapsedClockTimeString(ms: number): string {
  const [hours, minutes, seconds] = getElapsedClockTime(ms);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default Task;

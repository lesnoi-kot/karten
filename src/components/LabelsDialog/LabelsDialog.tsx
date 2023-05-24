import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Checkbox,
  Stack,
  Button,
  Avatar,
  Popover,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  PopoverProps,
  ListSubheader,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";

import { useTask } from "queries/tasks";
import { getColorName } from "utils/color";
import { useLabel } from "queries/labels";
import { useCurrentBoardId } from "context/CurrentBoardProvider";
import { useAPI } from "context/APIProvider";
import { ColorName, ID, Label } from "models/types";
import { boardKeys } from "queries/boards";
import { DEFAULT_COLOR_NAME, ENTITY_COLOR } from "models/constants";
import { ColorTags } from "components/ui/ColorTag";

export function LabelsDialog({
  taskId,
  ...props
}: { taskId: ID } & PopoverProps) {
  const api = useAPI();
  const boardId = useCurrentBoardId()!;
  const [editorVisible, setEditorVisible] = useState(false);
  const [editLabel, setEditLabel] = useState<Label | null>(null);

  const { data: labels = [] } = useQuery({
    enabled: !!boardId,
    queryKey: boardKeys.board(boardId),
    queryFn: () => api.getBoard(boardId),
    select: (board) => board.labels,
  });

  const {
    query: { data: task },
    addLabel,
    deleteLabel,
    invalidate,
  } = useTask(taskId);

  const checkedLabels = useMemo(
    () => new Set(task ? task.labels.map((label) => label.id) : []),
    [task],
  );

  return (
    <Popover {...props}>
      <Stack gap={1} p={1} minWidth="300px" maxWidth="300px">
        <List subheader={<ListSubheader>Labels</ListSubheader>} disablePadding>
          {labels.map((label) => (
            <ListItem
              key={label.id}
              secondaryAction={
                <IconButton
                  title="Edit label"
                  size="small"
                  onClick={() => {
                    setEditLabel(label);
                    setEditorVisible(false);
                  }}
                >
                  <EditIcon fontSize="small" color="action" />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Checkbox
                  size="small"
                  checked={checkedLabels.has(label.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addLabel.mutate(label.id, {
                        onSuccess() {
                          invalidate();
                        },
                      });
                    } else {
                      deleteLabel.mutate(label.id, {
                        onSuccess() {
                          invalidate();
                        },
                      });
                    }
                  }}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  sx={{
                    backgroundColor: label.color,
                    width: "2rem",
                    height: "2rem",
                  }}
                >
                  {""}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={label.name} />
            </ListItem>
          ))}
        </List>

        {editorVisible && (
          <NewLabel
            onClose={() => {
              setEditorVisible(false);
            }}
          />
        )}

        {editLabel && (
          <EditLabel
            label={editLabel}
            onClose={() => {
              setEditLabel(null);
            }}
          />
        )}

        {!editorVisible && !editLabel && (
          <Button
            disableElevation
            size="small"
            onClick={() => {
              setEditorVisible(true);
              setEditLabel(null);
            }}
          >
            Create a new label
          </Button>
        )}
      </Stack>
    </Popover>
  );
}

type EditLabelProps = {
  label: Label;
  onClose(): void;
};

function EditLabel({ label, onClose }: EditLabelProps) {
  const queryClient = useQueryClient();
  const boardId = useCurrentBoardId()!;

  const {
    mutation: { mutate: editLabel, isLoading },
    deletion: { mutate: deleteLabelFromBoard, isLoading: isDeleting },
  } = useLabel(label.id);

  function onSuccess() {
    queryClient.invalidateQueries({
      queryKey: boardKeys.board(boardId),
    });
    onClose();
  }

  return (
    <LabelComposer
      key={label.id}
      title="Edit label"
      initialName={label.name}
      initialColor={getColorName(label.color)}
      isLoading={isLoading}
      onSubmit={(name, color) => {
        editLabel({ name, color }, { onSuccess });
      }}
      buttonCaption="Save"
    >
      <LoadingButton
        size="small"
        loading={isDeleting}
        color="error"
        onClick={() => {
          deleteLabelFromBoard(undefined, { onSuccess });
        }}
      >
        Delete
      </LoadingButton>
      <Button size="small" onClick={onClose}>
        Cancel
      </Button>
    </LabelComposer>
  );
}

type NewLabelProps = {
  onClose(): void;
};

function NewLabel({ onClose }: NewLabelProps) {
  const queryClient = useQueryClient();
  const api = useAPI();
  const boardId = useCurrentBoardId()!;

  const { mutate: addLabel, isLoading } = useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      api.addLabel({ boardId, name, color }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: boardKeys.board(boardId) });
      onClose();
    },
  });

  return (
    <LabelComposer
      title="New label"
      initialName=""
      initialColor={DEFAULT_COLOR_NAME}
      onSubmit={(name, color) => {
        addLabel({ name, color });
      }}
      isLoading={isLoading}
      buttonCaption="Create"
    >
      <Button size="small" onClick={onClose}>
        Cancel
      </Button>
    </LabelComposer>
  );
}

type LabelComposerProps = {
  title: string;
  initialName: string;
  initialColor: ColorName;
  children: React.ReactNode;
  isLoading: boolean;
  buttonCaption: string;
  onSubmit(name: string, color: string): void;
};

function LabelComposer({
  children,
  title,
  initialName,
  initialColor,
  isLoading,
  onSubmit,
  buttonCaption,
}: LabelComposerProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState<ColorName>(initialColor);

  return (
    <Stack gap={1}>
      <Typography>{title}</Typography>

      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        autoFocus
        margin="dense"
        size="small"
        placeholder="Write a name"
        variant="outlined"
        inputProps={{
          maxLength: 32,
        }}
      />

      <Stack direction="row" gap={1} flexWrap="wrap" width="100%">
        <ColorTags
          checkedColor={color}
          onClick={(color) => {
            setColor(color);
          }}
        />
      </Stack>

      <Stack gap={0.5} mt={1}>
        <LoadingButton
          disableElevation
          size="small"
          variant="contained"
          loading={isLoading}
          onClick={() => {
            onSubmit(name, ENTITY_COLOR[color]);
          }}
        >
          {buttonCaption}
        </LoadingButton>

        {children}
      </Stack>
    </Stack>
  );
}

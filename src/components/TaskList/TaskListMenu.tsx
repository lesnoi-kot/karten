import { useRef } from "react";
import { produce } from "immer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useAPI } from "context/APIProvider";
import { Board, TaskList } from "models/types";
import useToggle from "components/hooks/useToggle";

export default function TaskListMenu({ taskList }: { taskList: TaskList }) {
  const [visible, show, hide] = useToggle(false);
  const anchorEl = useRef(null);
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: clearTaskList } = useMutation({
    mutationFn: () => api.clearTaskList(taskList.id),
    onMutate() {
      queryClient.setQueryData<Board>(
        ["boards", { boardId: taskList.boardId }],
        (board) =>
          produce(board, (draft) => {
            draft?.getTaskList(taskList.id)?.clear();
          }),
      );
    },
  });

  const { mutate: deleteTaskList } = useMutation({
    mutationFn: () => api.deleteTaskList(taskList.id),
    onMutate() {
      queryClient.setQueryData<Board>(
        ["boards", { boardId: taskList.boardId }],
        (board) =>
          produce(board, (draft) => {
            draft?.deleteTaskList(taskList.id);
          }),
      );
    },
  });

  const onClear = () => {
    clearTaskList();
    hide();
  };

  const onDelete = () => {
    deleteTaskList();
    hide();
  };

  return (
    <>
      <IconButton size="small" onClick={show} ref={anchorEl}>
        <MoreVertIcon fontSize="small" color="action" />
      </IconButton>
      <Menu
        anchorEl={anchorEl.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={visible}
        onClose={hide}
      >
        <MenuItem onClick={onClear}>Clear</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}

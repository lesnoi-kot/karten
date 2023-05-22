import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useOptimisticBoardMutation } from "queries/boards";
import { useAPI } from "context/APIProvider";
import { TaskList } from "models/types";
import useToggle from "components/hooks/useToggle";

export default function TaskListMenu({ taskList }: { taskList: TaskList }) {
  const [visible, show, hide] = useToggle(false);
  const anchorEl = useRef(null);
  const api = useAPI();
  const optimisticMutate = useOptimisticBoardMutation();

  const { mutate: clearTaskList } = useMutation({
    mutationFn: () => api.clearTaskList(taskList.id),
    onMutate() {
      optimisticMutate((draft) => {
        draft?.getTaskList(taskList.id)?.clear();
      });
    },
  });

  const { mutate: deleteTaskList } = useMutation({
    mutationFn: () => api.deleteTaskList(taskList.id),
    onMutate() {
      optimisticMutate((draft) => {
        draft?.deleteTaskList(taskList.id);
      });
    },
  });

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
        <MenuItem
          onClick={() => {
            clearTaskList();
            hide();
          }}
        >
          Clear
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteTaskList();
            hide();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

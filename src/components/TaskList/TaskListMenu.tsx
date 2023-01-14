import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { ID } from "models/types";
import useToggle from "components/hooks/useToggle";

import { actions } from "app/apiInteraction";

export default function TaskListMenu({ id }: { id: ID }) {
  const dispatch = useDispatch();
  const [visible, show, hide] = useToggle(false);
  const anchorEl = useRef(null);

  const onClear = () => {
    dispatch(actions.clearTaskListRequest(id));
    hide();
  };

  const onDelete = () => {
    dispatch(actions.deleteTaskListRequest(id));
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

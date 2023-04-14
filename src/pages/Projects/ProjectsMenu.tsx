import React from "react";
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

import { actions as apiActions } from "app/apiInteraction";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { useAppDispatch } from "app/hooks";

import { actions } from "./slice";

export function ProjectsMenu() {
  const dispatch = useAppDispatch();

  const showNewProjectDialog = () => {
    dispatch(drawerMenuActions.close());
    dispatch(actions.showNewProjectDialog());
  };

  const deleteAllProjects = () => {
    dispatch(drawerMenuActions.close());
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "You are about to delete all projects",
        okAction: apiActions.deleteAllProjects(),
      }),
    );
  };

  return (
    <List dense subheader={<ListSubheader>Projects</ListSubheader>}>
      <ListItemButton onClick={showNewProjectDialog}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create project" />
      </ListItemButton>
      <ListItemButton onClick={deleteAllProjects}>
        <ListItemIcon>
          <DeleteForeverIcon />
        </ListItemIcon>
        <ListItemText primary="Delete all" />
      </ListItemButton>
    </List>
  );
}

export default React.memo(ProjectsMenu);

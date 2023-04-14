import React from "react";
import { useParams } from "react-router-dom";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";
import PhotoIcon from "@mui/icons-material/Photo";

import { useAppSelector, useAppDispatch } from "app/hooks";
import { selectProjectById } from "app/projects/selectors";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { actions as newBoardDialogActions } from "app/widgets/newBoardDialog";

export function ProjectMenu() {
  const { id: projectId = "" } = useParams();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );

  if (!project) {
    return null;
  }

  const onProjectAdd = () => {
    dispatch(drawerMenuActions.close());
    dispatch(newBoardDialogActions.showDialog(projectId));
  };

  const onProjectClear = () => {
    dispatch(drawerMenuActions.close());
    dispatch(
      confirmDialogActions.showDialog({
        okAction: apiActions.clearProject(projectId),
        okButtonText: "yes",
        title: "Warning",
        text: `Delete all boards in the project "${project.name}"?`,
      }),
    );
  };

  return (
    <List dense subheader={<ListSubheader>{project.name}</ListSubheader>}>
      <ListItemButton onClick={onProjectAdd}>
        <ListItemIcon>
          <PhotoIcon />
        </ListItemIcon>
        <ListItemText primary="Change logo" />
      </ListItemButton>
      <ListItemButton onClick={onProjectAdd}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create board" />
      </ListItemButton>
      <ListItemButton onClick={onProjectClear}>
        <ListItemIcon>
          <ClearAllIcon />
        </ListItemIcon>
        <ListItemText primary="Delete all boards" />
      </ListItemButton>
      <ListItemButton onClick={onProjectClear}>
        <ListItemIcon>
          <DeleteForeverIcon />
        </ListItemIcon>
        <ListItemText primary="Delete project" />
      </ListItemButton>
    </List>
  );
}

export default React.memo(ProjectMenu);

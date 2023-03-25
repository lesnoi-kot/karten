import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
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
    <>
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">Projects</Typography>
      </Box>

      <Divider />

      <List>
        <ListItem button onClick={showNewProjectDialog}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add project" />
        </ListItem>
        <ListItem button onClick={deleteAllProjects}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Delete all" />
        </ListItem>
      </List>
      <Divider />
    </>
  );
}

export default React.memo(ProjectsMenu);

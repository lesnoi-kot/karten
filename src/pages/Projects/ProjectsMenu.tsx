import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

import { useAPI } from "context/APIProvider";
import { actions as drawerMenuActions } from "store/widgets/drawerMenu";
import { useAppDispatch } from "store/hooks";
import { showSnackbar } from "store/snackbars";
import { actions as confirmDialogActions } from "store/widgets/confirmDialog";

import { BaseMenu } from "components/Navbar/DrawerMenu";

import { actions } from "./slice";

export function ProjectsMenu() {
  const api = useAPI();
  const dispatch = useAppDispatch();

  const { mutate: deleteAll } = useMutation({
    mutationFn: () => api.deleteAllProjects(),
    onSuccess: () => {
      dispatch(
        showSnackbar({
          message: `All projects have been deleted!`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());
    },
  });

  const showNewProjectDialog = () => {
    dispatch(drawerMenuActions.close());
    dispatch(actions.showNewProjectDialog());
  };

  const deleteAllProjects = () => {
    dispatch(drawerMenuActions.close());

    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        okButtonText: "yes",
        text: "Delete all your projects?",
        okCallback: () => {
          deleteAll();
          dispatch(confirmDialogActions.setDialogLoading());
        },
      }),
    );
  };

  return (
    <BaseMenu>
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
    </BaseMenu>
  );
}

export default React.memo(ProjectsMenu);

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  List,
  CircularProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";
import PhotoIcon from "@mui/icons-material/Photo";

import { showSnackbar } from "store/snackbars";
import { useAppDispatch } from "store/hooks";
import { useAPI } from "context/APIProvider";
import { actions as confirmDialogActions } from "store/widgets/confirmDialog";
import { actions as drawerMenuActions } from "store/widgets/drawerMenu";
import { actions as newBoardDialogActions } from "store/widgets/newBoardDialog";
import { useClearProject, useDeleteProject } from "queries/projects";

import { BaseMenu } from "components/Navbar/DrawerMenu";

export function ProjectMenu() {
  const api = useAPI();
  const { id: projectId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    enabled: false,
    queryKey: ["projects", { projectId }],
    queryFn: () => api.getProject(projectId),
  });

  const { mutate: clearProject } = useClearProject({
    projectId,
    onSuccess() {
      dispatch(
        showSnackbar({
          message: `Project "${project?.name}" has been cleared`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());
    },
  });

  const { mutate: deleteProject } = useDeleteProject({
    projectId,
    onSuccess() {
      dispatch(
        showSnackbar({
          message: `Project "${project?.name}" has been deleted`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());

      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <Box textAlign="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  const onChangeLogo = () => {
    dispatch(drawerMenuActions.close());
  };

  const onProjectAdd = () => {
    dispatch(drawerMenuActions.close());
    dispatch(newBoardDialogActions.showDialog(projectId));
  };

  const onProjectClear = () => {
    dispatch(drawerMenuActions.close());
    dispatch(
      confirmDialogActions.showDialog({
        okCallback() {
          dispatch(confirmDialogActions.setDialogLoading());
          clearProject();
        },
        okButtonText: "yes",
        title: "Warning",
        text: `Delete all boards in the project "${project?.name}"?`,
      }),
    );
  };

  const onProjectDelete = () => {
    dispatch(drawerMenuActions.close());
    dispatch(
      confirmDialogActions.showDialog({
        okCallback() {
          dispatch(confirmDialogActions.setDialogLoading());
          deleteProject();
        },
        okButtonText: "yes",
        title: "Warning",
        text: `Delete project "${project?.name}"?`,
      }),
    );
  };

  return (
    <BaseMenu>
      {!!project && (
        <List dense subheader={<ListSubheader>{project.name}</ListSubheader>}>
          <ListItemButton onClick={onChangeLogo}>
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
          <ListItemButton onClick={onProjectDelete}>
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            <ListItemText primary="Delete project" />
          </ListItemButton>
        </List>
      )}
    </BaseMenu>
  );
}

export default React.memo(ProjectMenu);

import React from "react";
import { useParams } from "react-router-dom";
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

import { useAppSelector, useAppDispatch } from "app/hooks";
import { selectProjectById } from "app/projects/selectors";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";

export function ProjectMenu() {
  const { id: projectId = "" } = useParams();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );

  if (!project) {
    return null;
  }

  return (
    <>
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">Boards</Typography>
      </Box>

      <Divider />

      <List>
        <ListItem
          button
          onClick={() => {
            dispatch(drawerMenuActions.close());
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add board" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            dispatch(drawerMenuActions.close());
            dispatch(
              confirmDialogActions.showDialog({
                okAction: apiActions.clearProject(projectId),
                okButtonText: "yes",
                title: "Warning",
                text: `Delete all boards in the project "${project.name}"?`,
              }),
            );
          }}
        >
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Delete all boards" />
        </ListItem>
      </List>
      <Divider />
    </>
  );
}

export default React.memo(ProjectMenu);

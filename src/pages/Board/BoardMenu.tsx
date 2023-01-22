import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Link from "components/Link";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";

export function BoardMenu() {
  const { id: boardId = "", taskId: selectedTaskId = "" } = useParams();
  const dispatch = useDispatch();

  const onBoardDelete = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "You are about to delete this board",
        okAction: apiActions.deleteBoardRequest(boardId),
      }),
    );
    // onClose();
  };

  const onBoardClear = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "You are about to delete all lists in this board",
        okAction: apiActions.clearBoardRequest(boardId),
      }),
    );
    // onClose();
  };

  const onBackgroundChange = () => {};

  return (
    <>
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">Menu</Typography>
      </Box>

      <Divider />

      <List>
        <ListItem component={Link} to="/projects">
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Back to main" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={onBackgroundChange}>
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Change background" />
        </ListItem>

        <ListItem button onClick={onBoardClear}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText primary="Clear" />
        </ListItem>

        <ListItem button onClick={onBoardDelete}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Delete board" />
        </ListItem>
      </List>
    </>
  );
}

export default React.memo(BoardMenu);

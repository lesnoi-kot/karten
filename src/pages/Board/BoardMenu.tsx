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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import Link from "components/Link";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { useAppSelector } from "app/hooks";
import { selectBoard } from "app/boards/selectors";

export function BoardMenu() {
  const { id: boardId = "" } = useParams();
  const dispatch = useDispatch();

  const board = useAppSelector((state) => selectBoard(state, boardId));

  if (!board) {
    return null;
  }

  const onBoardDelete = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "You are about to delete this board",
        okAction: apiActions.deleteBoardRequest(boardId),
      }),
    );
    dispatch(drawerMenuActions.close());
  };

  const onBoardClear = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "You are about to delete all lists in this board",
        okAction: apiActions.clearBoardRequest(boardId),
      }),
    );
    dispatch(drawerMenuActions.close());
  };

  const onBackgroundChange = () => {
    dispatch(drawerMenuActions.close());
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">{board.name}</Typography>
      </Box>
      <Divider />

      <List>
        <ListItem button onClick={onBackgroundChange}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" />
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

        <ListItem component={Link} to={`/projects/${board.projectId}`}>
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Back to the project" />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
}

export default React.memo(BoardMenu);

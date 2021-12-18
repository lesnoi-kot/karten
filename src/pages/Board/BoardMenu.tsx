import React from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Link from "components/Link";
import { ID } from "models/types";
import { actions as apiActions } from "app/apiInteraction";
import { showDialog } from "components/ConfirmDialog/slice";

import styles from "./styles.module.css";

type Props = {
  boardId: ID;
  open: boolean;
  onClose(): void;
};

export function BoardMenu({ boardId, open, onClose }: Props) {
  const dispatch = useDispatch();

  const onBoardDelete = () => {
    dispatch(
      showDialog({
        title: "Warning",
        text: "You are about to delete this board",
        okAction: apiActions.deleteBoardRequest(boardId),
      })
    );
    onClose();
  };

  const onBoardClear = () => {
    dispatch(
      showDialog({
        title: "Warning",
        text: "You are about to delete all lists in this board",
        okAction: apiActions.clearBoardRequest(boardId),
      })
    );
    onClose();
  };

  const onBackgroundChange = () => {};

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ className: clsx(styles.boardMenu) }}
    >
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">Menu</Typography>
      </Box>

      <Divider />

      <List>
        <ListItem component={Link} route="pages:projects">
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
    </Drawer>
  );
}

export default React.memo(BoardMenu);

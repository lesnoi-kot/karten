import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PhotoIcon from "@mui/icons-material/Photo";
import AddIcon from "@mui/icons-material/Add";

import { actions as apiActions } from "app/apiInteraction";
import { useAppSelector } from "app/hooks";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { selectBoard } from "app/boards/selectors";
import Link from "components/Link";
import useToggle from "components/hooks/useToggle";
import ChangeCoverDialog from "components/Board/ChangeCoverDialog";
import { BaseMenu } from "components/Navbar/DrawerMenu";
import { selectProjectById } from "app/projects";

export function BoardMenu() {
  const { id: boardId = "" } = useParams();
  const dispatch = useDispatch();
  const [dialogVisible, showDialog, hideDialog] = useToggle(false);

  const board = useAppSelector((state) => selectBoard(state, boardId));
  const project = useAppSelector((state) =>
    board ? selectProjectById(state, board.projectId) : null,
  );

  if (!board) {
    return null;
  }

  const onBoardDelete = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "Delete this board?",
        okAction: apiActions.deleteBoardRequest(boardId),
        okButtonText: "yes",
      }),
    );
    dispatch(drawerMenuActions.close());
  };

  const onBoardClear = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "Delete all lists in this board?",
        okAction: apiActions.clearBoardRequest(boardId),
        okButtonText: "yes",
      }),
    );
    dispatch(drawerMenuActions.close());
  };

  const onBackgroundChange = () => {
    dispatch(drawerMenuActions.close());
    showDialog();
  };

  return (
    <BaseMenu
      mainSectionChildren={
        <ListItemButton
          component={Link}
          to={`/projects/${board.projectId}`}
          onClick={() => {
            dispatch(drawerMenuActions.close());
          }}
        >
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary={`Back to "${project?.name ?? ""}"`} />
        </ListItemButton>
      }
    >
      <List dense subheader={<ListSubheader>{board.name}</ListSubheader>}>
        <ListItemButton
          onClick={() => {
            dispatch(drawerMenuActions.close());
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create list" />
        </ListItemButton>

        <ListItemButton onClick={onBackgroundChange}>
          <ListItemIcon>
            <PhotoIcon />
          </ListItemIcon>
          <ListItemText primary="Change cover image" />
        </ListItemButton>

        <ListItemButton onClick={onBoardClear}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText primary="Clear" />
        </ListItemButton>

        <ListItemButton onClick={onBoardDelete}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItemButton>
      </List>
      <ChangeCoverDialog
        board={board}
        open={dialogVisible}
        onClose={hideDialog}
      />
    </BaseMenu>
  );
}

export default React.memo(BoardMenu);

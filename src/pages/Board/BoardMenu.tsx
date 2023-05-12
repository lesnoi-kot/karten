import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
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

import { showSnackbar } from "store/snackbars";
import { useAPI } from "context/APIProvider";
import { useAppDispatch } from "store/hooks";
import { actions as confirmDialogActions } from "store/widgets/confirmDialog";
import { actions as drawerMenuActions } from "store/widgets/drawerMenu";

import Link from "components/Link";
import useToggle from "components/hooks/useToggle";
import ChangeCoverDialog from "components/Board/ChangeCoverDialog";
import { BaseMenu } from "components/Navbar/DrawerMenu";

export function BoardMenu() {
  const api = useAPI();
  const navigate = useNavigate();
  const { id: boardId = "" } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [coverDialogVisible, showCoverDialog, hideCoverDialog] =
    useToggle(false);

  const { data: board } = useQuery({
    queryKey: ["boards", { boardId }],
    queryFn: () => api.getBoard(boardId),
    onSuccess() {},
  });

  const { mutate: deleteBoard } = useMutation({
    mutationFn: () => api.deleteBoard(boardId),
    onSuccess: () => {
      dispatch(
        showSnackbar({
          message: `Board "${board?.name}" has been deleted!`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());

      queryClient.invalidateQueries({
        queryKey: ["projects", { projectId: board?.projectId }],
      });
      navigate("/");
    },
  });

  const { mutate: clearBoard } = useMutation({
    mutationFn: () => api.deleteBoard(boardId),
    onSuccess: () => {
      dispatch(
        showSnackbar({
          message: `Board "${board?.name}" has been cleared!`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());

      queryClient.invalidateQueries({
        queryKey: ["boards", { boardId }],
      });
      navigate("/");
    },
  });

  const onBoardDelete = () => {
    dispatch(
      confirmDialogActions.showDialog({
        title: "Warning",
        text: "Delete this board?",
        okCallback() {
          dispatch(confirmDialogActions.setDialogLoading());
          deleteBoard();
        },
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
        okCallback() {
          dispatch(confirmDialogActions.setDialogLoading());
          clearBoard();
        },
        okButtonText: "yes",
      }),
    );
    dispatch(drawerMenuActions.close());
  };

  const onBackgroundChange = () => {
    dispatch(drawerMenuActions.close());
    showCoverDialog();
  };

  return (
    <BaseMenu
      mainSectionChildren={
        <ListItemButton
          component={Link}
          to={`/projects/${board?.projectId}`}
          onClick={() => {
            dispatch(drawerMenuActions.close());
          }}
        >
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary={`Back to "${board?.projectName ?? ""}"`} />
        </ListItemButton>
      }
    >
      <List dense subheader={<ListSubheader>{board?.name}</ListSubheader>}>
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
      {board && (
        <ChangeCoverDialog
          board={board}
          open={coverDialogVisible}
          onClose={hideCoverDialog}
        />
      )}
    </BaseMenu>
  );
}

export default React.memo(BoardMenu);

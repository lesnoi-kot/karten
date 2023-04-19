import { memo } from "react";
import { Fab, SxProps, Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import NewProjectDialog from "components/Project/NewProjectDialog";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { actions, selectIsNewProjectDialogOpened } from "./slice";

const sxFab: SxProps<Theme> = {
  position: "fixed",
  bottom: (theme) => theme.spacing(3),
  right: (theme) => theme.spacing(3),
};

function NewProjectActionButton() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsNewProjectDialogOpened);

  const openDialog = () => {
    dispatch(actions.showNewProjectDialog());
  };

  const closeDialog = () => {
    dispatch(actions.closeNewProjectDialog());
  };

  return (
    <>
      <Fab color="secondary" variant="extended" sx={sxFab} onClick={openDialog}>
        <AddIcon />
        Create project
      </Fab>

      <NewProjectDialog isOpen={isOpen} onClose={closeDialog} />
    </>
  );
}

export default memo(NewProjectActionButton);

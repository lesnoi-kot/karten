import { useState, memo } from "react";
import { Fab, SxProps, Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import NewProjectDialog from "components/Project/NewProjectDialog";

const sxFab: SxProps<Theme> = {
  position: "fixed",
  bottom: (theme) => theme.spacing(3),
  right: (theme) => theme.spacing(3),
};

function NewProjectActionButton() {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab color="secondary" variant="extended" sx={sxFab} onClick={openDialog}>
        <AddIcon />
        Add new project
      </Fab>

      <NewProjectDialog isOpen={isOpen} onClose={closeDialog} />
    </>
  );
}

export default memo(NewProjectActionButton);

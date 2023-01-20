import { useState } from "react";
import { Fab, SxProps, Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import NewProjectDialog from "components/Project/NewProjectDialog";

const fabStyle: SxProps<Theme> = {
  position: "fixed",
  bottom: (theme) => theme.spacing(3),
  right: (theme) => theme.spacing(3),
};

export default function NewProjectStub() {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        sx={fabStyle}
        onClick={openDialog}
      >
        <AddIcon />
        Add new project
      </Fab>

      <NewProjectDialog isOpen={isOpen} onClose={closeDialog} />
    </>
  );
}

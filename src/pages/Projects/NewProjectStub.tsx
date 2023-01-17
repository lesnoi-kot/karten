import { useState } from "react";
import { Button } from "@mui/material";

import NewProjectDialog from "components/Project/NewProjectDialog";

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
      <Button onClick={openDialog}>Add new project</Button>
      <NewProjectDialog isOpen={isOpen} onClose={closeDialog} />
    </>
  );
}

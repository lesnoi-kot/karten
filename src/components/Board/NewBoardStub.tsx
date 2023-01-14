import React, { useCallback } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { ID } from "models/types";
import { NewBoardDialog } from "components/Board";
import { PreviewCardIconButton } from "components/ui/PreviewCard";

export default function NewBoardStub({ projectId }: { projectId: ID }) {
  const [isOpen, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      <PreviewCardIconButton onClick={openDialog}>
        <AddCircleOutlineIcon htmlColor="black" fontSize="large" />
      </PreviewCardIconButton>
      <NewBoardDialog
        projectId={projectId}
        isOpen={isOpen}
        onClose={closeDialog}
      />
    </>
  );
}

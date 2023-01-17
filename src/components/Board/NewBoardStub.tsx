import { useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import { ID } from "models/types";
import { NewBoardDialog } from "components/Board";
import { PreviewCardIconButton } from "components/ui/PreviewCard";

export default function NewBoardStub({ projectId }: { projectId: ID }) {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      <PreviewCardIconButton onClick={openDialog} title="Create new board">
        <AddIcon fontSize="medium" />
      </PreviewCardIconButton>
      <NewBoardDialog
        projectId={projectId}
        isOpen={isOpen}
        onClose={closeDialog}
      />
    </>
  );
}

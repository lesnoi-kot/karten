import { useCallback } from "react";
import { NewBoardDialog } from "components/Board";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  selectNewBoardDialogWidgetState,
  actions,
} from "app/widgets/newBoardDialog";

export function NewBoardDialogWidget() {
  const dispatch = useAppDispatch();
  const { isOpen, projectId } = useAppSelector(selectNewBoardDialogWidgetState);

  const closeDialog = useCallback(() => {
    dispatch(actions.closeDialog());
  }, [dispatch]);

  if (!projectId) {
    return null;
  }

  return (
    <NewBoardDialog
      projectId={projectId}
      isOpen={isOpen}
      onClose={closeDialog}
    />
  );
}

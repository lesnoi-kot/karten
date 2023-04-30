import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { NewBoardDialog } from "components/Board";
import {
  selectNewBoardDialogWidgetState,
  actions,
} from "app/widgets/newBoardDialog";
import { Project } from "models/types";

export function NewBoardDialogWidget() {
  const dispatch = useAppDispatch();
  const { isOpen, projectId } = useAppSelector(selectNewBoardDialogWidgetState);

  const { data: project } = useQuery({
    enabled: false,
    queryKey: ["projects"],
    select: (projects: Project[]) => projects.find((p) => p.id === projectId),
  });

  const closeDialog = useCallback(() => {
    dispatch(actions.closeDialog());
  }, [dispatch]);

  if (!project) {
    return null;
  }

  return (
    <NewBoardDialog project={project} isOpen={isOpen} onClose={closeDialog} />
  );
}

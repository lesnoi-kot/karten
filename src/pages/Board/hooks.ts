import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ID } from "models/types";

export const useBoardMethods = (boardId: ID) => {
  const navigate = useNavigate();

  const onTaskClick = useCallback(
    (taskId: ID) => {
      navigate({ search: `?taskId=${taskId}` }, { replace: false });
    },
    [navigate],
  );

  const onTaskModalClose = useCallback(() => {
    navigate(`/boards/${boardId}`, { replace: true });
  }, [navigate, boardId]);

  return {
    onTaskClick,
    onTaskModalClose,
  };
};

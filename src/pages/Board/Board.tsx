import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, CircularProgress } from "@mui/material";

import logger from "services/logger";
import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { useAppSelector } from "app/hooks";

import { TaskModal } from "components/Task";
import ErrorSplash from "components/ui/ErrorSplash";
import makePage from "pages/makePageHOC";

import { useDashboardMethods, selectShouldRedirectToProject } from "./slice";
import BoardName from "./BoardName";
import ScrollableSpace from "./ScrollableSpace";
import TaskLists from "./TaskLists";
import PageTitle from "./PageTitle";
import { selectBoard } from "app/boards/selectors";

function BoardPage() {
  const { id: boardId = "", taskId: selectedTaskId = "" } = useParams();
  const board = useAppSelector((state) => selectBoard(state, boardId));
  const { load, reload, isLoading, isLoaded, isFailed, state, error } =
    useRequest(apiActions.boardRequest);
  const { onTaskClick, onTaskModalClose } = useDashboardMethods(boardId);
  const shouldRedirectToProject = useAppSelector(selectShouldRedirectToProject);

  useEffect(() => load(boardId), [load, boardId]);

  if (shouldRedirectToProject) {
    return <Navigate to="/projects" />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          backgroundImage: board?.coverURL
            ? `url("${board.coverURL}")`
            : undefined,
          backgroundSize: "cover",
        }}
      >
        <PageTitle boardId={boardId} selectedTaskId={selectedTaskId} />

        {isLoaded && (
          <Box textAlign="center">
            <BoardName boardId={boardId} />
          </Box>
        )}

        {isLoading && (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        )}

        {isFailed && <ErrorSplash message={error} retry={reload} />}

        {isLoaded && (
          <ScrollableSpace disabled>
            <TaskLists boardId={boardId} onTaskClick={onTaskClick} />
          </ScrollableSpace>
        )}

        {selectedTaskId && (
          <TaskModal onClose={onTaskModalClose} taskId={selectedTaskId} />
        )}
      </Box>
    </DndProvider>
  );
}

export default makePage(BoardPage);

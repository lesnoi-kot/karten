import { useEffect } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, CircularProgress } from "@mui/material";

import logger from "services/logger";
import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { useAppSelector } from "app/hooks";
import { selectBoard } from "app/boards/selectors";

import makePage from "pages/makePageHOC";
import { TaskModal } from "components/Task";
import ErrorSplash from "components/ui/ErrorSplash";

import { useDashboardMethods, selectShouldRedirectToProject } from "./slice";
import ScrollableSpace from "./ScrollableSpace";
import BoardName from "./BoardName";
import TaskLists from "./TaskLists";
import PageTitle from "./PageTitle";

function BoardPage() {
  const { id: boardId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const board = useAppSelector((state) => selectBoard(state, boardId));
  const { load, reload, isLoading, isLoaded, isFailed, error } = useRequest(
    apiActions.boardRequest,
  );
  const { onTaskClick, onTaskModalClose } = useDashboardMethods(boardId);
  const shouldRedirectToProject = useAppSelector(selectShouldRedirectToProject);
  const selectedTaskId = searchParams.get("taskId");

  useEffect(() => load(boardId), [load, boardId]);

  if (shouldRedirectToProject) {
    return <Navigate to="/projects" />;
  }

  if (!board) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          backgroundImage: board.coverURL
            ? `url("${board.coverURL}")`
            : undefined,
          backgroundSize: "cover",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PageTitle boardId={boardId} selectedTaskId={selectedTaskId} />

        {isLoading && (
          <Box textAlign="center" pt={3}>
            <CircularProgress />
          </Box>
        )}

        {isFailed && <ErrorSplash message={error} retry={reload} />}

        {isLoaded && (
          <>
            <Box pt={2} pb={3} textAlign="center">
              <BoardName boardId={boardId} />
            </Box>

            <ScrollableSpace
              disabled={false}
              px={2}
              pb={2}
              overflow="scroll"
              flexGrow={1}
            >
              <TaskLists boardId={boardId} onTaskClick={onTaskClick} />
            </ScrollableSpace>
          </>
        )}

        {selectedTaskId && (
          <TaskModal onClose={onTaskModalClose} taskId={selectedTaskId} />
        )}
      </Box>
    </DndProvider>
  );
}

export default makePage(BoardPage);

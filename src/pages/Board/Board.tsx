import { useParams, useSearchParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useColorScheme,
  Box,
  CircularProgress,
  Breadcrumbs,
  Typography,
} from "@mui/material";

import makePage from "pages/makePageHOC";
import { TaskModal } from "components/Task";
import ErrorSplash from "components/ui/ErrorSplash";
import Link from "components/Link";
import { Board } from "models/types";
import { useBoard } from "store/hooks/boards";

import { useBoardMethods } from "./hooks";
import ScrollableSpace from "./ScrollableSpace";
import BoardName from "./BoardName";
import TaskLists from "./TaskLists";
import PageTitle from "./PageTitle";

function BoardPage() {
  const { id: boardId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");
  const { colorScheme } = useColorScheme();

  const {
    data: board,
    refetch,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useBoard(boardId);

  const { onTaskClick, onTaskModalClose } = useBoardMethods(boardId);

  if (isLoading) {
    return (
      <Box textAlign="center" pt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!board) {
    return <ErrorSplash title="404" message="Project not found" />;
  }

  const sxBackground =
    colorScheme === "dark"
      ? {
          backgroundColor: "black",
        }
      : {
          backgroundImage: board.coverURL
            ? `url("${board.coverURL}")`
            : undefined,
          boxShadow: board.coverURL
            ? "0px 50px 40px 0px rgba(0,0,0,0.75) inset"
            : undefined,
          backgroundSize: "cover",
          backgroundColor: board.color,
        };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(100vh - 64px)"
        sx={sxBackground}
      >
        <PageTitle board={board} selectedTaskId={selectedTaskId} />

        {isLoading && (
          <Box textAlign="center" pt={3}>
            <CircularProgress />
          </Box>
        )}

        {isError && <ErrorSplash message={String(error)} retry={refetch} />}

        {isSuccess && (
          <>
            <Box pl={3} pt={1} pb={3}>
              <PageBreadcrumbs board={board} />
              <BoardName board={board} />
            </Box>

            <ScrollableSpace
              disabled={false}
              px={2}
              pb={2}
              overflow="scroll"
              flexGrow={1}
            >
              <TaskLists board={board} onTaskClick={onTaskClick} />
            </ScrollableSpace>
          </>
        )}
        <TaskModal onClose={onTaskModalClose} taskId={selectedTaskId} />
      </Box>
    </DndProvider>
  );
}

function PageBreadcrumbs({ board }: { board: Board }) {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator="⧽"
      sx={{ color: "white", fontSize: "1rem" }}
    >
      <Link underline="hover" color="inherit" fontSize="inherit" to="/projects">
        Projects
      </Link>
      <Link
        underline="hover"
        color="inherit"
        fontSize="inherit"
        to={`/projects/${board.projectId}`}
      >
        {board.projectName}
      </Link>
      <Typography fontSize="inherit" color="inherit">
        {board.name}
      </Typography>
    </Breadcrumbs>
  );
}

export default makePage(BoardPage);

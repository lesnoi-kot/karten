import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IconButton, Box } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import logger from "services/logger";
import { FetchState } from "utils/types";
import { actions as apiActions } from "app/apiInteraction";

import { TaskModal } from "components/Task";
import { NavbarContent } from "components/Navbar";
import makePage from "pages/makePageHOC";

import { useDashboardMethods, getBoardFetchState } from "./slice";
import BoardName from "./BoardName";
import BoardMenu from "./BoardMenu";
import Status from "./Status";
import ScrollableSpace from "./ScrollableSpace";
import TaskLists from "./TaskLists";
import PageTitle from "./PageTitle";

function BoardPage() {
  const { boardId = "", taskId: selectedTaskId = "" } = useParams();

  const dispatch = useDispatch();
  const fetchState = useSelector(getBoardFetchState);

  const {
    onTaskClick,
    onTaskModalClose,
    sidebarIsOpen,
    openSidebar,
    closeSidebar,
  } = useDashboardMethods(boardId);

  useEffect(() => {
    dispatch(apiActions.boardRequest(boardId));
  }, [dispatch, boardId]);

  logger.debug("Render: DashboardPage", { boardId, fetchState });

  return (
    <>
      <PageTitle boardId={boardId} selectedTaskId={selectedTaskId} />
      <Box my={2} textAlign="center">
        <BoardName boardId={boardId} />
      </Box>

      <NavbarContent>
        <IconButton
          edge="start"
          color="secondary"
          onClick={openSidebar}
          size="large"
        >
          <MenuIcon />
        </IconButton>
      </NavbarContent>

      <Status />

      {fetchState === FetchState.FULFILLED && (
        <ScrollableSpace disabled>
          <TaskLists boardId={boardId} onTaskClick={onTaskClick} />
        </ScrollableSpace>
      )}

      {selectedTaskId && (
        <TaskModal onClose={onTaskModalClose} taskId={selectedTaskId} />
      )}

      <BoardMenu
        boardId={boardId}
        open={sidebarIsOpen}
        onClose={closeSidebar}
      />
    </>
  );
}

export default makePage(BoardPage);

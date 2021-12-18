import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, CircularProgress } from "@mui/material";

import { FetchState } from "utils/types";
import { buildURL } from "utils/routes";

import { BoardPreview, NewBoardStub } from "components/Board";
import Heading from "components/ui/Heading";
import Link from "components/Link";

import { actions as apiActions } from "app/apiInteraction";
import { selectBoardsIds } from "app/boards/selectors";
import makePage from "pages/makePageHOC";

import { selectFetchState } from "./slice";
import styles from "./styles.module.css";

function Projects() {
  const dispatch = useDispatch();
  const boards = useSelector(selectBoardsIds);
  const fetchState = useSelector(selectFetchState);

  useEffect(() => {
    dispatch(apiActions.boardsRequest());
  }, [dispatch]);

  return (
    <>
      <Box mt={2} mb={5} textAlign="center">
        <Heading>Personal boards</Heading>
      </Box>

      {fetchState === FetchState.PENDING && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {fetchState === FetchState.FULFILLED && (
        <Grid container spacing={2} className={styles.boardsPreviewContainer}>
          {boards.map((id) => (
            <Grid
              key={id}
              item
              component={Link}
              to={buildURL("pages:board", { boardId: id })}
              underline="none"
            >
              <BoardPreview id={id} />
            </Grid>
          ))}
          <Grid key="NewBoardStub" item>
            <NewBoardStub />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default makePage(Projects);

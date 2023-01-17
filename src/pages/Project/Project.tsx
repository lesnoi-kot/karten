import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Grid, CircularProgress } from "@mui/material";

import { useAppSelector } from "app/hooks";
import { buildURL } from "utils/routes";

import { BoardPreview, NewBoardStub } from "components/Board";
import Heading from "components/ui/Heading";
import Link from "components/Link";

import { actions as apiActions } from "app/apiInteraction";
import { selectBoardsIdsByProjectId } from "app/boards/selectors";
import { selectProjectById } from "app/projects/selectors";
import { useRequestInfo } from "app/apiInteraction/hooks";
import makePage from "pages/makePageHOC";

function Project() {
  const dispatch = useDispatch();
  const { projectId = "" } = useParams();
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );
  const boards = useAppSelector((state) =>
    selectBoardsIdsByProjectId(state, projectId),
  );
  const { isLoading, isLoaded } = useRequestInfo(projectId);

  useEffect(() => {
    dispatch(apiActions.getProject(projectId, projectId));
  }, [dispatch, projectId]);

  return (
    <>
      <Box mt={2} mb={5} textAlign="center">
        <Heading>{project?.name ?? ""}</Heading>
      </Box>

      {isLoading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {isLoaded && (
        <Grid
          container
          gap={2}
          width="60%"
          marginX="auto"
          justifyContent="center"
        >
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
            <NewBoardStub projectId={projectId} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default makePage(Project);

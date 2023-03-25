import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { Box, Container, CircularProgress } from "@mui/material";

import { useAppSelector } from "app/hooks";

import { actions as apiActions } from "app/apiInteraction";
import { selectBoardsIdsByProjectId } from "app/boards/selectors";
import { selectProjectById } from "app/projects/selectors";
import { useRequestInfo } from "app/apiInteraction/hooks";
import makePage from "pages/makePageHOC";
import BoardPreviewList from "components/Board/BoardPreviewList";
import ProjectName from "./ProjectName";

function Project() {
  const dispatch = useDispatch();
  const { id: projectId = "" } = useParams();
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
      <Helmet title={`${project?.name ?? "Project"} | Karten`} />

      {isLoading && (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {isLoaded && (
        <Container maxWidth="lg">
          <Box mt={2} mb={3} textAlign="center">
            <ProjectName projectId={projectId} />
          </Box>
          <BoardPreviewList ids={boards} showComposer projectId={projectId} />
        </Container>
      )}
    </>
  );
}

export default makePage(Project);

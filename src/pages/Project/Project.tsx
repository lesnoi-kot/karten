import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Box,
  Container,
  CircularProgress,
  Avatar,
  Typography,
  Breadcrumbs,
} from "@mui/material";

import { useAppSelector } from "app/hooks";

import { actions as apiActions } from "app/apiInteraction";
import { selectBoardsIdsByProjectId } from "app/boards/selectors";
import { selectProjectById } from "app/projects/selectors";
import { useRequestInfo } from "app/apiInteraction/hooks";
import makePage from "pages/makePageHOC";
import BoardPreviewList from "components/Board/BoardPreviewList";
import Link from "components/Link";

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

      {project && isLoaded && (
        <Container maxWidth="lg" sx={{ pt: 1 }}>
          <PageBreadcrumbs />
          <Box mt={2} mb={3} display="flex" gap={4}>
            {project.avatarURL && (
              <Avatar
                src={project.avatarURL}
                variant="rounded"
                sx={{ width: 64, height: 64 }}
                alt="Project logo"
                title="Project logo"
              />
            )}
            <ProjectName projectId={projectId} />
          </Box>
          <Typography
            variant="h4"
            component="h2"
            mt={4}
            mb={3}
            display="flex"
            alignItems="center"
          >
            Boards
          </Typography>
          <BoardPreviewList ids={boards} showComposer projectId={projectId} />
        </Container>
      )}
    </>
  );
}

function PageBreadcrumbs() {
  const { id: projectId = "" } = useParams();
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );

  if (!project) {
    return null;
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" separator="⧽">
      <Link underline="hover" color="inherit" to="/projects">
        Projects
      </Link>
      <Typography>{project.name}</Typography>
    </Breadcrumbs>
  );
}

export default makePage(Project);

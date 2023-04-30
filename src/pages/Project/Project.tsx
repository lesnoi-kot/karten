import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  CircularProgress,
  Avatar,
  Typography,
  Breadcrumbs,
} from "@mui/material";

import makePage from "pages/makePageHOC";
import { useAPI } from "context/APIProvider";
import BoardPreviewList from "components/Board/BoardPreviewList";
import ErrorSplash from "components/ui/ErrorSplash";
import Link from "components/Link";

import ProjectName from "./ProjectName";

function Project() {
  const api = useAPI();
  const { id: projectId = "" } = useParams();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", { projectId }],
    queryFn: () => api.getProject(projectId),
    retry: false,
  });

  return (
    <>
      <Helmet title={`${project?.name ?? "Project"} | Karten`} />

      {isLoading && (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {isError && <ErrorSplash title="404" message="Project not found" />}

      {project && (
        <Container maxWidth="lg" sx={{ pt: 1 }}>
          <Breadcrumbs aria-label="breadcrumb" separator="⧽">
            <Link underline="hover" color="inherit" to="/projects">
              Projects
            </Link>
            <Typography>{project.name}</Typography>
          </Breadcrumbs>

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
            <ProjectName project={project} />
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
          <BoardPreviewList
            boards={project.boards ?? []}
            showComposer
            projectId={projectId}
          />
        </Container>
      )}
    </>
  );
}

export default makePage(Project);

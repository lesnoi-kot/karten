import { Helmet } from "react-helmet";
import { Box, CircularProgress, Container } from "@mui/material";

import { useProjects } from "app/hooks/projects";
import makePage from "pages/makePageHOC";
import ErrorSplash from "components/ui/ErrorSplash";

import RecentlyViewed from "./RecentlyViewed";
import ProjectsList from "./ProjectsList";
import NewProjectActionButton from "./NewProjectActionButton";
import StarredBoards from "./StarredBoards";

function ProjectsPage() {
  const { isLoading, isError, isSuccess, error, refetch } = useProjects({
    includeBoards: true,
  });

  return (
    <>
      <Helmet title="Projects | Karten" />

      {isLoading && (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {isError && <ErrorSplash message={error.toString()} retry={refetch} />}

      {isSuccess && (
        <Container maxWidth="lg" sx={{ paddingBottom: 3 }}>
          <StarredBoards />
          <RecentlyViewed />
          <ProjectsList />
          <NewProjectActionButton />
        </Container>
      )}
    </>
  );
}

export default makePage(ProjectsPage);

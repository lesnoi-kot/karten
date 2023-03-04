import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Box, CircularProgress, Container } from "@mui/material";

import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import makePage from "pages/makePageHOC";

import ErrorSplash from "components/ui/ErrorSplash";

import RecentlyViewed from "./RecentlyViewed";
import ProjectsList from "./ProjectsList";
import NewProjectActionButton from "./NewProjectActionButton";
import StarredBoards from "./StarredBoards";

function ProjectsPage() {
  const { load, reload, isLoading, isLoaded, isFailed, error } = useRequest(
    apiActions.getProjects,
  );

  useEffect(() => load(undefined), [load]);

  return (
    <>
      <Helmet title="Projects | Karten" />

      {isLoading && (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {isFailed && <ErrorSplash message={error} retry={reload} />}

      {isLoaded && (
        <Container maxWidth="lg">
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

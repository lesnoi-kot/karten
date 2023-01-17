import { useEffect } from "react";
import { Box, CircularProgress, Container } from "@mui/material";

import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import makePage from "pages/makePageHOC";

import ErrorSplash from "components/ui/ErrorSplash";

import RecentlyViewed from "./RecentlyViewed";
import ProjectsList from "./ProjectsList";

function Projects() {
  const { load, reload, isLoading, isLoaded, isFailed, error } = useRequest(
    apiActions.getProjects,
  );

  useEffect(() => load(undefined), [load]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isFailed) {
    return <ErrorSplash message={error} retry={reload} />;
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <RecentlyViewed />
      <ProjectsList />
    </Container>
  );
}

export default makePage(Projects);

import { useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";

import { buildURL } from "utils/routes";
import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { selectProjectsIds } from "app/projects/selectors";
import { useAppSelector } from "app/hooks";
import makePage from "pages/makePageHOC";

import Heading from "components/ui/Heading";
import ProjectPreview from "components/Project/ProjectPreview";
import ErrorSplash from "components/ui/ErrorSplash";
import Link from "components/Link";

import NewProjectStub from "./NewProjectStub";

function Projects() {
  const { load, reload, isLoading, isLoaded, isError, error } = useRequest(
    apiActions.getProjects,
  );
  const projects = useAppSelector(selectProjectsIds);

  useEffect(() => load(undefined), [load]);

  return (
    <>
      <Box mt={2} mb={5} textAlign="center">
        <Heading>Projects</Heading>
      </Box>

      {isLoading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <ErrorSplash message={error && String(error)} retry={reload} />
      )}

      {isLoaded && (
        <Grid
          container
          gap={2}
          width="60%"
          marginX="auto"
          justifyContent="center"
        >
          {projects.map((projectId) => (
            <Grid
              key={projectId}
              item
              component={Link}
              to={buildURL("pages:project", { projectId })}
              underline="none"
            >
              <ProjectPreview id={projectId} />
            </Grid>
          ))}
          <Grid key="NewProjectStub" item>
            <NewProjectStub />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default makePage(Projects);

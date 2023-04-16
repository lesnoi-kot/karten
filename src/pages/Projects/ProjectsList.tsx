import { Stack, Typography } from "@mui/material";

import { selectProjectsIds } from "app/projects/selectors";
import { useAppSelector } from "app/hooks";

import ProjectInfo from "./ProjectInfo";

export default function ProjectsList() {
  const projects = useAppSelector(selectProjectsIds);

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        mt={2}
        mb={3}
        display="flex"
        alignItems="center"
      >
        Projects
      </Typography>

      {projects.length === 0 && (
        <Typography>You don't have any project yet.</Typography>
      )}

      <Stack gap={4}>
        {projects.map((projectId) => (
          <ProjectInfo key={projectId} id={projectId} />
        ))}
      </Stack>
    </>
  );
}

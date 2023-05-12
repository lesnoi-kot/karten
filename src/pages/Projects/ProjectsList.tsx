import { Stack, Typography } from "@mui/material";

import { Project } from "models/types";
import { useProjects } from "store/hooks/projects";

import ProjectInfo from "./ProjectInfo";

export default function ProjectsList() {
  const { data: projects } = useProjects({ includeBoards: true });

  if (!projects) {
    return null;
  }

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
        {projects.map((project: Project) => (
          <ProjectInfo key={project.id} project={project} />
        ))}
      </Stack>
    </>
  );
}

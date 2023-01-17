import { Stack, Typography } from "@mui/material";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

import { selectProjectsIds } from "app/projects/selectors";
import { useAppSelector } from "app/hooks";

import NewProjectStub from "./NewProjectStub";
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
        <WorkspacesIcon />
        Projects
      </Typography>

      <Stack gap={4}>
        {projects.map((projectId) => (
          <ProjectInfo key={projectId} id={projectId} />
        ))}
      </Stack>
      <NewProjectStub />
    </>
  );
}

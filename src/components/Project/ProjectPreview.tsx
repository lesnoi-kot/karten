import React from "react";
import { Typography } from "@mui/material";

import { RootState } from "app";
import { useAppSelector } from "app/hooks";
import { selectProjectById } from "app/projects/selectors";
import { selectBoardsCountOfProject } from "app/boards/selectors";
import { ID } from "models/types";
import Stub from "components/Stub";
import { PreviewCard } from "components/ui/PreviewCard";

function ProjectPreview({ id }: { id: ID }) {
  const project = useAppSelector((state: RootState) =>
    selectProjectById(state, id),
  );
  const boardsCount = useAppSelector((state) =>
    selectBoardsCountOfProject(state, id),
  );

  if (!project) {
    return <Stub />;
  }

  const { name } = project;

  return (
    <PreviewCard>
      <Typography>{name}</Typography>
      <Typography>📑 {boardsCount}</Typography>
    </PreviewCard>
  );
}

export default ProjectPreview;

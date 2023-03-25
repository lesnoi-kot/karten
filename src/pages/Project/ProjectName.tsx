import React from "react";
import { useDispatch } from "react-redux";

import { actions } from "app/apiInteraction";
import { ID } from "models/types";
import { useAppSelector } from "app/hooks";
import { selectProjectById } from "app/projects";
import { EditablePageTitle } from "components/EditablePageTitle";

export function ProjectName({ projectId }: { projectId: ID }) {
  const dispatch = useDispatch();
  const project = useAppSelector((state) =>
    selectProjectById(state, projectId),
  );

  if (!project) {
    return null;
  }

  const onNameChange = (name: string) => {
    if (name && name !== project.name) {
      dispatch(actions.updateProject({ id: projectId, name }));
    }
  };

  return <EditablePageTitle value={project.name} onChange={onNameChange} />;
}

export default React.memo(ProjectName);

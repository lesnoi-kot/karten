import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Project } from "models/types";
import { EditablePageTitle } from "components/EditablePageTitle";

export default function ProjectName({ project }: { project: Project }) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: changeName } = useMutation({
    mutationFn: (name: string) => api.editProject({ id: project.id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", { projectId: project.id }],
      });
    },
  });

  return <EditablePageTitle value={project.name} onChange={changeName} />;
}

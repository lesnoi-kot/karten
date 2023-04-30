import {
  useQuery,
  useMutation,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { useAppDispatch } from "app/hooks";
import { showSnackbar } from "app/snackbars";
import { ID, Project } from "models/types";
import { APIError } from "services/api";

type UseProjectsArgs = UseQueryOptions<any, APIError> & {
  includeBoards: boolean;
};

export function useProjects<T>({ includeBoards, ...options }: UseProjectsArgs) {
  const api = useAPI();

  return useQuery({
    queryKey: ["projects", { includeBoards }],
    queryFn: () => api.getProjects({ includeBoards }),
    ...options,
  });
}

type UseClearProjectArgs = Pick<UseQueryOptions, "onSuccess"> & {
  projectId: ID;
};

export function useClearProject(args: UseClearProjectArgs) {
  const { projectId, onSuccess } = args;
  const api = useAPI();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.clearProject(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      onSuccess?.(data);
    },
  });

  return mutation;
}

type UseDeleteProjectArgs = Pick<UseQueryOptions, "onSuccess"> & {
  projectId: ID;
};

export function useDeleteProject(args: UseDeleteProjectArgs) {
  const { projectId, onSuccess } = args;
  const api = useAPI();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.deleteProject(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      onSuccess?.(data);
    },
  });

  return mutation;
}

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Task, ID } from "models/types";
import { useAppDispatch } from ".";

export function useTask(taskId: ID) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryFn: () => api.getTask(taskId),
    queryKey: ["tasks", { taskId }],
    retry: 0,
    refetchInterval: false,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Task>) => api.editTask({ ...data, id: taskId }),
    onMutate(updatedTask) {
      queryClient.setQueryData(["tasks", { taskId }], updatedTask);
    },
  });

  return { query, mutation };
}

export function useEditTask(taskId: ID) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<Task>) => api.editTask({ ...data, id: taskId }),
    onMutate(updatedTask) {
      queryClient.setQueryData(["tasks", { taskId }], updatedTask);
    },
  });

  return mutation;
}

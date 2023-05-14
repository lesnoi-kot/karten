import {
  useQuery,
  useMutation,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Comment, ID } from "models/types";

export function useComment(commentId: ID) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text: string) => api.editComment({ id: commentId, text }),
    onMutate(updatedComment) {
      // queryClient.setQueryData(["tasks", { taskId: commentId }], updatedTask);
    },
  });

  const deletion = useMutation({
    mutationFn: () => api.deleteComment(commentId),
    onMutate() {
      // queryClient.setQueryData(["tasks", { taskId: commentId }], updatedTask);
    },
  });

  return { mutation, deletion };
}

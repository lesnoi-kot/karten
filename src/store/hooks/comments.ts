import {
  useQuery,
  useMutation,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Comment, ID } from "models/types";
import { useAppDispatch } from ".";

export function useComment(commentId: ID) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: (text: string) => api.editComment({ id: commentId, text }),
    onSuccess(updatedComment) {
      // queryClient.setQueryData(["tasks", { taskId: commentId }], updatedTask);
    },
  });

  const deletion = useMutation({
    mutationFn: () => api.deleteComment(commentId),
    onSuccess() {
      // queryClient.setQueryData(["tasks", { taskId: commentId }], updatedTask);
    },
  });

  return { mutation, deletion };
}

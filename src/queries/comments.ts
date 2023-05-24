import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";

import { useAPI } from "context/APIProvider";
import { ID, Task, Comment } from "models/types";
import { APIError } from "services/api";

import { taskKeys } from "./tasks";
import { useFileDeleter } from "./files";

type UseCommentArgs = {
  commentId: ID;
  taskId: ID;
  enabled?: boolean;
  initialData?: Comment;
};

export const commentKeys = {
  comment(commentId: ID) {
    return ["comments", { commentId }];
  },
};

export function useComment(args: UseCommentArgs) {
  const { commentId, enabled = false, initialData } = args;
  const api = useAPI();
  const queryClient = useQueryClient();
  const queryKey = commentKeys.comment(commentId);

  const query = useQuery<Comment, APIError>({
    enabled,
    initialData,
    retry: 0,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchInterval: false,
    queryKey: commentKeys.comment(commentId),
    queryFn: () => api.getComment(commentId),
  });

  const mutation = useMutation({
    mutationFn: (text: string) => api.editComment({ id: commentId, text }),
    onSuccess(updatedComment) {
      queryClient.setQueryData<Comment>(queryKey, updatedComment);
    },
  });

  const deletion = useMutation({
    mutationFn: () => api.deleteComment(commentId),
    onMutate() {
      const comment = query.data;

      if (comment) {
        queryClient.setQueryData<Task>(taskKeys.task(comment.taskId), (task) =>
          produce(task, (draft) => {
            draft?.deleteComment(commentId);
          }),
        );
      }
    },
  });

  const attach = useMutation({
    mutationFn: (filesId: ID[]) =>
      api.attachFileToComment({ id: commentId, filesId }),
    onSuccess() {
      invalidate();
    },
  });

  const unattach = useFileDeleter({
    onSuccess() {
      invalidate();
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return { query, mutation, deletion, attach, unattach, invalidate };
}

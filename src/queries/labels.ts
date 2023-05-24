import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Label } from "models/types";

export function useLabel(labelId: number) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<Label>) => api.editLabel({ ...data, labelId }),
  });

  const deletion = useMutation({
    mutationFn: () => api.deleteLabel(labelId),
  });

  return {
    mutation,
    deletion,
  };
}

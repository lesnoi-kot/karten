import {
  useQuery,
  useMutation,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { ID } from "models/types";

export function useBoard(boardId: ID) {
  const api = useAPI();

  const query = useQuery({
    retry: 0,
    refetchInterval: false,
    queryKey: ["boards", { boardId }],
    queryFn: () => api.getBoard(boardId),
  });

  return query;
}

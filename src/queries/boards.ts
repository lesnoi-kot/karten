import { Draft, produce } from "immer";
import { useQuery, useQueryClient, QueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { ID, Board } from "models/types";
import { useCurrentBoardId } from "context/CurrentBoardProvider";
import { APIError } from "services/api";

type BoardDraftMutator = (boardDraft: Draft<Board>) => void;

export const boardKeys = {
  board(boardId: ID) {
    return ["boards", { boardId }];
  },
};

export function useBoard(boardId: ID) {
  const api = useAPI();

  const query = useQuery<Board, APIError>({
    retry: 0,
    refetchInterval: false,
    queryKey: boardKeys.board(boardId),
    queryFn: () => api.getBoard(boardId),
  });

  return query;
}

export function useOptimisticBoardMutation() {
  const queryClient = useQueryClient();
  const boardId = useCurrentBoardId();

  return function (mutation: BoardDraftMutator) {
    if (boardId) {
      mutateBoard(queryClient, boardId, mutation);
    }
  };
}

export function mutateBoard(
  queryClient: QueryClient,
  boardId: ID,
  mutation: BoardDraftMutator,
) {
  queryClient.setQueryData<Board>(boardKeys.board(boardId), (board) =>
    board ? produce(board, mutation) : board,
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Board } from "models/types";
import { EditablePageTitle } from "components/EditablePageTitle";

export default function BoardName({ board }: { board: Board }) {
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: changeName } = useMutation({
    mutationFn: (name: string) => api.editBoard({ id: board.id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", { boardId: board.id }],
      });
    },
  });

  return (
    <EditablePageTitle
      value={board.name}
      onChange={changeName}
      sx={{ color: "white" }}
    />
  );
}

import { useMutation } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Board } from "models/types";
import { useOptimisticBoardMutation } from "queries/boards";
import { EditablePageTitle } from "components/EditablePageTitle";

export default function BoardName({ board }: { board: Board }) {
  const api = useAPI();
  const optimisticMutate = useOptimisticBoardMutation();

  const { mutate: changeName } = useMutation({
    mutationFn: (name: string) => api.editBoard({ id: board.id, name }),
    onMutate(newName) {
      optimisticMutate((draft) => {
        draft.name = newName;
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

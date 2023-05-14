import { useCallback } from "react";
import { produce } from "immer";
import { InputBaseComponentProps } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { Board, TaskList } from "models/types";
import EditableTextField from "components/EditableTextField";

const nameStyle: InputBaseComponentProps = { style: { fontWeight: "bold" } };

export default function TaskListName({ taskList }: { taskList: TaskList }) {
  const { id, boardId, name } = taskList;
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate: changeName } = useMutation({
    mutationFn: (newName: string) => api.editTaskList({ id, name: newName }),
    onMutate(newName) {
      queryClient.setQueryData<Board>(["boards", { boardId }], (board) =>
        produce(board, (draft) => {
          draft?.getTaskList(id)?.setName(newName);
        }),
      );
    },
  });

  const onNameChange = useCallback(
    (newName: string) => {
      if (name !== newName) {
        changeName(newName);
      }
    },
    [name],
  );

  return (
    <EditableTextField
      value={name}
      onChange={onNameChange}
      fullWidth
      inputProps={nameStyle}
    />
  );
}

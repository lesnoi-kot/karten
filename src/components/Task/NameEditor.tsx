import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { actions as apiActions } from "app/apiInteraction";
import { Task } from "models/types";
import EditableText from "components/EditableTextField";

export type Props = {
  task: Task;
};

function NameEditor({ task }: Props) {
  const { id: taskId, name } = task;
  const dispatch = useDispatch();

  const onNameChange = useCallback(
    (newName: string) => {
      if (name !== newName) {
        dispatch(apiActions.updateTaskRequest({ taskId, name: newName }));
      }
    },
    [taskId, dispatch, name],
  );

  return (
    <EditableText
      value={name}
      onChange={onNameChange}
      size="medium"
      sx={{
        fontSize: "1.5rem",
      }}
    />
  );
}

export default NameEditor;

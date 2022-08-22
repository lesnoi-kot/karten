import { useSelector } from "react-redux";

import { ID } from "models/types";
import { selectTaskById } from "app/tasks/selectors";
import { RootState } from "app";

export const useTask = (taskId: ID) => {
  const task = useSelector((state: RootState) => selectTaskById(state, taskId));
  return { task };
};

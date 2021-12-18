import { useSelector } from "react-redux";

import { ID } from "models/types";
import { selectTaskById } from "app/tasks/selectors";

export const useTask = (taskId: ID) => {
  const task = useSelector((state) => selectTaskById(state, taskId));
  return { task };
};

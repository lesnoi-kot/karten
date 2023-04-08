import { RootState } from "app";
import { User } from "models/types";
import { isNil } from "ramda";

export const selectCurrentUser = (state: RootState): User | null => {
  if (isNil(state.entities.users.userId)) {
    return null;
  }

  return state.entities.users.items[state.entities.users.userId] ?? null;
};

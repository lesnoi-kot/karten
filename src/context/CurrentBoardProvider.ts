import React from "react";

import { ID } from "models/types";

type Context = {
  boardId: ID | null;
};

export const CurrentBoardContext = React.createContext<Context>({
  boardId: null,
});

export const useCurrentBoardId = () =>
  React.useContext(CurrentBoardContext).boardId;

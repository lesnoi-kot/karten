import React from "react";
import { useDispatch } from "react-redux";

import { actions } from "app/apiInteraction";
import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";
import { useAppSelector } from "app/hooks";
import { EditablePageTitle } from "components/EditablePageTitle";

export function BoardName({ boardId }: { boardId: ID }) {
  const dispatch = useDispatch();
  const board = useAppSelector((state) => selectBoard(state, boardId));

  if (!board) {
    return null;
  }

  const onNameChange = (name: string) => {
    if (name && name !== board.name) {
      dispatch(actions.updateBoardRequest({ id: boardId, name }));
    }
  };

  return (
    <EditablePageTitle
      value={board.name}
      onChange={onNameChange}
      sx={{ color: "white" }}
    />
  );
}

export default React.memo(BoardName);

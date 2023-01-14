import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "app";
import EditableTextField from "components/EditableTextField";
import { actions } from "app/apiInteraction";
import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";

import styles from "./styles.module.css";

type Props = {
  boardId: ID;
};

export function BoardName({ boardId }: Props) {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => selectBoard(state, boardId));

  if (!board) {
    return null;
  }

  const onNameChange = (name: string) => {
    if (name && name !== board.name) {
      dispatch(actions.updateBoardRequest({ id: boardId, name }));
    }
  };

  return (
    <EditableTextField
      value={board.name}
      onChange={onNameChange}
      className={styles.boardName}
      inputProps={{
        className: styles.boardName,
      }}
    />
  );
}

export default React.memo(BoardName);

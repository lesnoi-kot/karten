import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { RootState } from "app";
import { ID } from "models/types";
import { selectBoardName } from "app/boards/selectors";
import { selectTaskNameById } from "app/tasks/selectors";

type Props = {
  boardId: ID;
  selectedTaskId: ID | null;
};

export function PageTitle({ boardId, selectedTaskId }: Props) {
  const taskName = useSelector((state: RootState) =>
    selectedTaskId ? selectTaskNameById(state, selectedTaskId) : null,
  );
  const boardName = useSelector((state: RootState) =>
    selectBoardName(state, boardId),
  );

  return (
    <Helmet>
      <title>
        {taskName ? `${taskName} | ` : ""}
        {boardName ? `${boardName} | ` : ""}Karten
      </title>
    </Helmet>
  );
}

export default React.memo(PageTitle);

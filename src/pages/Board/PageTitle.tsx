import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { ID } from "models/types";
import { selectBoardName } from "app/boards/selectors";
import { selectTaskNameById } from "app/tasks/selectors";

type Props = {
  boardId: ID;
  selectedTaskId: ID;
};

export function PageTitle({ boardId, selectedTaskId }: Props) {
  const taskName = useSelector((state) =>
    selectTaskNameById(state, selectedTaskId)
  );
  const boardName = useSelector((state) => selectBoardName(state, boardId));

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

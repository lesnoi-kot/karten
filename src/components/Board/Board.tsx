import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import logger from "services/logger";
import { ID } from "models/types";

import { actions } from "app/boards";

type Props = {
  id: ID;
  children: any;
};

function Board({ id, children }: Props) {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(actions.boardRequest(id));
  // }, [id, dispatch]);

  logger.debug("Render: Board", id);

  return <>{children}</>;
}

export default Board;

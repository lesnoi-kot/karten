import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "app";
import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";
import Stub from "components/Stub";
import { PreviewCard } from "components/ui/PreviewCard";

function BoardPreview({ id }: { id: ID }) {
  const board = useSelector((state: RootState) => selectBoard(state, id));

  if (!board) {
    return <Stub />;
  }

  const { name } = board;

  return <PreviewCard>{name}</PreviewCard>;
}

export default BoardPreview;

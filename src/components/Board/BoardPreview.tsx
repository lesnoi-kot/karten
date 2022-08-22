import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";
import Stub from "components/Stub";

import styles from "./styles.module.css";
import { RootState } from "app";

type Props = {
  id: ID;
};

function BoardPreview({ id }: Props) {
  const board = useSelector((state: RootState) => selectBoard(state, id));

  if (!board) {
    return <Stub />;
  }

  const { name } = board;

  return (
    <Box className={styles.boardPreview}>
      <Box className={styles.boardPreviewName}>{name}</Box>
    </Box>
  );
}

export default BoardPreview;

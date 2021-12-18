import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";
import Stub from "components/Stub";

import styles from "./styles.module.css";

type Props = {
  id: ID;
};

function BoardPreview({ id }: Props) {
  const board = useSelector((state) => selectBoard(state, id));

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

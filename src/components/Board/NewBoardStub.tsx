import React from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { NewBoardDialog } from "components/Board";
import { actions } from "app/apiInteraction";

import styles from "./styles.module.css";

export default function NewBoardStub() {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const addBoard = (name: string) => {
    dispatch(actions.addBoardRequest({ name }));
  };

  return (
    <>
      <Box className={styles.newBoardStub} onClick={openDialog}>
        <AddCircleOutlineIcon htmlColor="black" fontSize="large" />
      </Box>
      <NewBoardDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onAction={addBoard}
      />
    </>
  );
}

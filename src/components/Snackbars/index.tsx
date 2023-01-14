import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { selectState, actions } from "./slice";

function Snackbars() {
  const dispatch = useAppDispatch();
  const { isOpen, message, type } = useAppSelector(selectState);

  const onClose = () => {
    dispatch(actions.close());
  };

  return (
    <Snackbar open={isOpen} onClose={onClose}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}

export default Snackbars;

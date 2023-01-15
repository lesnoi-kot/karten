import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { selectors, actions } from "app/snackbars";

function Snackbars() {
  const dispatch = useAppDispatch();
  const { isOpen, message, type } = useAppSelector(selectors.selectState);

  const onClose = () => {
    dispatch(actions.closeSnackbar());
  };

  return (
    <Snackbar open={isOpen} onClose={onClose}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}

export default Snackbars;

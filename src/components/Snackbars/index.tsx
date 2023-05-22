import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

import { useAppDispatch, useAppSelector } from "store/hooks";

import { selectors, actions } from "store/snackbars";

function Snackbars() {
  const dispatch = useAppDispatch();
  const { isOpen, message, type } = useAppSelector(selectors.selectState);

  const onClose = () => {
    dispatch(actions.closeSnackbar());
  };

  return (
    <Snackbar open={isOpen} onClose={onClose} autoHideDuration={5000}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}

export default Snackbars;

import ConfirmDialogWidget from "widgets/ConfirmDialogWidget";
import Snackbars from "components/Snackbars";
import NewBoardDialogWidget from "widgets/NewBoardDialogWidget";

export function Widgets() {
  return (
    <>
      <ConfirmDialogWidget />
      <Snackbars />
      <NewBoardDialogWidget />
    </>
  );
}

export default Widgets;

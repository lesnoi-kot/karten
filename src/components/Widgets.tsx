import ConfirmDialog from "components/ConfirmDialog";
import Snackbars from "components/Snackbars";
import NewBoardDialogWidget from "widgets/NewBoardDialogWidget";

export function Widgets() {
  return (
    <>
      <ConfirmDialog />
      <Snackbars />
      <NewBoardDialogWidget />
    </>
  );
}

export default Widgets;

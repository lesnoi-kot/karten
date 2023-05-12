import { useSelector, useDispatch } from "react-redux";

import { actions, selectState } from "store/widgets/confirmDialog";
import ConfirmDialog from "components/ConfirmDialog";

export function ConfirmDialogWidget() {
  const dispatch = useDispatch();
  const {
    isOpen,
    text,
    title,
    okAction,
    okButtonText,
    cancelButtonText,
    closeOnOk,
    okCallback,
    isLoading,
  } = useSelector(selectState);
  const onClose = () => dispatch(actions.closeDialog());

  const onOK = () => {
    if (okAction) {
      dispatch(okAction);
    }

    if (okCallback) {
      okCallback();
    }

    if (closeOnOk) {
      onClose();
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      isLoading={isLoading}
      title={title}
      text={text}
      onOK={onOK}
      onClose={onClose}
      okButtonText={okButtonText}
      cancelButtonText={cancelButtonText}
    />
  );
}

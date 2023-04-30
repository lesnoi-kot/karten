import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actions, selectState } from "app/widgets/confirmDialog";
import { useRequestInfoOfAction } from "app/apiInteraction/hooks";
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
    isLoading: isLoading,
  } = useSelector(selectState);
  const { isLoaded, isLoading: isRequestLoading } =
    useRequestInfoOfAction(okAction);

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

  useEffect(() => {
    if (isLoaded) {
      onClose();
    }
  }, [dispatch, isLoaded]);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      isLoading={isLoading || isRequestLoading}
      title={title}
      text={text}
      onOK={onOK}
      onClose={onClose}
      okButtonText={okButtonText}
      cancelButtonText={cancelButtonText}
    />
  );
}

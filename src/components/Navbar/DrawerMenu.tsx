import { Drawer } from "@mui/material";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";

export default function DrawerMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpen);

  const onClose = () => {
    dispatch(actions.close());
  };

  return <Drawer open={isOpen} onClose={onClose}></Drawer>;
}

import { Drawer } from "@mui/material";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";

type Props = {
  children: React.ReactNode;
};

export default function DrawerMenu({ children }: Props) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpen);

  const onClose = () => {
    dispatch(actions.close());
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      {children}
    </Drawer>
  );
}

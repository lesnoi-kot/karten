import { Drawer, IconButton, PaperProps } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";

type Props = {
  children: React.ReactNode;
};

const paperProps: PaperProps = {
  sx: {
    width: () => ({ xs: "100%", sm: "400px" }),
  },
};

const closeIconSx = {
  display: { xs: "block", sm: "none" },
  position: "absolute",
  right: 0,
};

export default function DrawerMenu({ children }: Props) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpen);

  const onClose = () => {
    dispatch(actions.close());
  };

  return (
    <Drawer
      PaperProps={paperProps}
      open={isOpen}
      onClose={onClose}
      anchor="left"
      variant="temporary"
    >
      <IconButton sx={closeIconSx} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      {children}
    </Drawer>
  );
}

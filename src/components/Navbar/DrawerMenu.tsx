import { Box, Drawer, IconButton, PaperProps, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";
import ColorThemeSwitch from "components/ColorThemeSwitch";

type Props = {
  children: React.ReactNode;
};

const paperProps: PaperProps = {
  sx: {
    width: () => ({ xs: "100%", sm: "400px" }),
  },
};

const sxCloseIcon = {
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
      <IconButton sx={sxCloseIcon} onClick={onClose}>
        <CloseIcon />
      </IconButton>

      <Box sx={{ flexGrow: "1" }}>{children}</Box>

      <Divider />
      <Box py={1} width="100%">
        <ColorThemeSwitch sx={{ display: "flex", justifyContent: "center" }} />
      </Box>
    </Drawer>
  );
}

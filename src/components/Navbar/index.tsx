import React from "react";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useAppDispatch } from "app/hooks";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";

import Heading from "components/ui/Heading";
import Link from "components/Link";
import ColorThemeSwitch from "components/ColorThemeSwitch";

import DrawerMenu from "./DrawerMenu";

export function NavbarTitle() {
  return (
    <Heading variant="h4">
      <Link to="/" color="inherit" underline="none">
        Karten
      </Link>
    </Heading>
  );
}

type Props = {
  drawerMenuElement?: React.ReactNode;
};

export default function Navbar({ drawerMenuElement }: Props) {
  const dispatch = useAppDispatch();

  return (
    <AppBar position="static">
      <Toolbar>
        {drawerMenuElement && (
          <IconButton
            edge="start"
            color="inherit"
            sx={{ marginRight: 2 }}
            onClick={() => {
              dispatch(drawerMenuActions.toggle());
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <NavbarTitle />
        <Box sx={{ flexGrow: 1 }} />

        <ColorThemeSwitch sx={{ display: { xs: "none", sm: "block" } }} />
      </Toolbar>

      {drawerMenuElement && <DrawerMenu>{drawerMenuElement}</DrawerMenu>}
    </AppBar>
  );
}

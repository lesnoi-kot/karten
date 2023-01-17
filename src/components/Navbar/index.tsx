import React from "react";
import ReactDOM from "react-dom";
import { AppBar, Toolbar, Box, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
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

export default function Navbar() {
  const dispatch = useAppDispatch();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box id="navbar-page-content" />
        <IconButton
          edge="start"
          onClick={() => {
            dispatch(drawerMenuActions.toggle());
          }}
        >
          <MenuIcon />
        </IconButton>
        <NavbarTitle />
        <Box sx={{ flexGrow: 1 }} />

        <ColorThemeSwitch />

        <IconButton color="inherit" edge="end" size="large">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>

      <DrawerMenu />
    </AppBar>
  );
}

export function NavbarContent({ children }: { children: React.ReactNode }) {
  const target = document.getElementById("navbar-page-content");

  if (!target) {
    return null;
  }

  return ReactDOM.createPortal(children, target);
}

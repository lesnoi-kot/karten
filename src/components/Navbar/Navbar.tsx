import React from "react";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useAppDispatch } from "app/hooks";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";

import Heading from "components/ui/Heading";
import Link from "components/Link";
import ColorThemeSwitch from "components/ColorThemeSwitch";

function NavbarTitle() {
  return (
    <Heading variant="h4">
      <Link to="/projects" color="inherit" underline="none">
        Karten
      </Link>
    </Heading>
  );
}

type Props = {
  renderMenuButton: boolean;
};

export default function Navbar({ renderMenuButton }: Props) {
  const dispatch = useAppDispatch();

  return (
    <AppBar
      position="static"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {renderMenuButton && (
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

        <ColorThemeSwitch
          size="small"
          iconColor="white"
          sx={{ display: { xs: "none", sm: "block" } }}
        />
      </Toolbar>
    </AppBar>
  );
}

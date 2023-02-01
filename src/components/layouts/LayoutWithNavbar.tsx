import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "components/Navbar/Navbar";
import Widgets from "components/Widgets";
import DrawerMenu from "components/Navbar/DrawerMenu";

type Props = {
  children: React.ReactNode;
};

export default function LayoutWithNavbar({ children }: Props) {
  return (
    <>
      {children && <DrawerMenu>{children}</DrawerMenu>}
      <Container disableGutters maxWidth={false}>
        <Navbar renderMenuButton={!!children} />
        <Container disableGutters maxWidth={false} component="main">
          <Outlet />
        </Container>
      </Container>
      <Widgets />
    </>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "components/Navbar";
import Widgets from "pages/Page/Widgets";

type Props = {
  children: React.ReactNode;
};

export default function LayoutWithNavbar({ children }: Props) {
  return (
    <>
      <Navbar drawerMenuElement={children} />
      <Container disableGutters maxWidth={false}>
        <Outlet />
      </Container>
      <Widgets />
    </>
  );
}

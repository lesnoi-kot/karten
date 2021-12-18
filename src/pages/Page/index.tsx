import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "components/Navbar";

import Widgets from "./Widgets";

function BasePage() {
  return (
    <>
      <Navbar />
      <Container disableGutters maxWidth={false}>
        <Outlet />
      </Container>
      <Widgets />
    </>
  );
}

export default BasePage;

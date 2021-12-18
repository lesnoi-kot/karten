import React from "react";
import ReactDOM from "react-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import styles from "./styles.module.css";

export function NavbarTitle() {
  return (
    <Typography variant="h5">
      <a href="/">Karten</a>
    </Typography>
  );
}

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box id="navbar-page-content" />
        <NavbarTitle />
        <Box className={styles.grow} />
        <IconButton color="inherit" size="large">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton edge="end" color="inherit" size="large">
          <AccountCircle />
        </IconButton>
      </Toolbar>
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

export default Navbar;

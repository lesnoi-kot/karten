import { useRef } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  MenuProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import { deepPurple } from "@mui/material/colors";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { actions as apiActions } from "app/apiInteraction";
import { selectCurrentUser } from "app/users/selectors";

import Heading from "components/ui/Heading";
import Link from "components/Link";
import ColorThemeSwitch from "components/ColorThemeSwitch";
import useToggle from "components/hooks/useToggle";

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
  const profileRef = useRef(null);
  const user = useAppSelector(selectCurrentUser);
  const [profileMenuIsVisible, showProfileMenu, hideProfileMenu] = useToggle();

  return (
    <AppBar
      position="static"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {renderMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              dispatch(drawerMenuActions.toggle());
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <NavbarTitle />

        <Box display="flex" flexGrow="1" />

        <ColorThemeSwitch
          size="small"
          iconColor="white"
          sx={{ display: { xs: "none", sm: "block" } }}
        />

        <IconButton
          color="inherit"
          ref={profileRef}
          onClick={showProfileMenu}
          size="small"
        >
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            {user?.name?.[0]?.toUpperCase() ?? "G"}
          </Avatar>
        </IconButton>
      </Toolbar>

      <ProfileMenu
        anchorEl={profileRef.current}
        open={profileMenuIsVisible}
        onClose={hideProfileMenu}
      />
    </AppBar>
  );
}

function ProfileMenu(props: MenuProps) {
  const dispatch = useAppDispatch();

  const onLogOut = () => {
    dispatch(apiActions.logOut());
    // props.onClose && props.onClose();
  };

  return (
    <Menu
      id="account-menu"
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      {...props}
    >
      <MenuItem>
        <Avatar /> Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogOut}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Log Out
      </MenuItem>
    </Menu>
  );
}

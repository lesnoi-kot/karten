import { useRef } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  MenuProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions as drawerMenuActions } from "app/widgets/drawerMenu";
import { actions as apiActions } from "app/apiInteraction";
import { selectCurrentUser } from "app/users/selectors";

import Heading from "components/ui/Heading";
import Link from "components/Link";
import ColorThemeSwitch from "components/ColorThemeSwitch";
import useToggle from "components/hooks/useToggle";
import ColoredAvatar from "components/ColoredAvatar";

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
          <ColoredAvatar src={user?.avatarURL}>
            {user?.name?.[0]?.toUpperCase() ?? "G"}
          </ColoredAvatar>
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

type ProfileMenuProps = MenuProps & {
  onClose: () => void;
};

function ProfileMenu({ onClose, ...props }: ProfileMenuProps) {
  const dispatch = useAppDispatch();

  const onLogOut = () => {
    dispatch(apiActions.logOut());
  };

  return (
    <Menu
      id="account-menu"
      PaperProps={{
        elevation: 1,
        sx: { mt: 1.5 },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={onClose}
      {...props}
    >
      <MenuItem component={Link} to="/profile" onClick={onClose} dense>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogOut} dense>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        Log Out
      </MenuItem>
    </Menu>
  );
}

import {
  Box,
  Drawer,
  IconButton,
  PaperProps,
  Divider,
  Avatar,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/users/selectors";
import { selectProjects } from "app/projects/selectors";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";
import ColorThemeSwitch from "components/ColorThemeSwitch";

type Props = {
  children: React.ReactNode;
};

const paperProps: PaperProps = {
  sx: {
    width: () => ({ xs: "100%", sm: "350px" }),
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
  const projects = useAppSelector(selectProjects);
  const user = useAppSelector(selectCurrentUser);

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

      {!!user && (
        <>
          <Box p={3} pb={2}>
            <Avatar
              src={user.avatarURL}
              variant="circular"
              alt={user.name}
              title="User avatar"
              sx={{ width: 56, height: 56 }}
            >
              {user.name[0]}
            </Avatar>
            <Typography mt={1} fontWeight={500}>
              {user.name}
            </Typography>
            {Boolean(user.url) && <Typography>{user.url}</Typography>}
          </Box>
          <Divider />
        </>
      )}

      <Box display="flex" gap={1} pt={2} flexDirection="column">
        <Box>{children}</Box>

        {projects.length > 0 && (
          <List dense subheader={<ListSubheader>All projects</ListSubheader>}>
            {projects.map((project) => (
              <ListItemButton key={project.id}>
                <ListItemText inset primary={project.name} />
              </ListItemButton>
            ))}
          </List>
        )}

        {!!user && (
          <Box>
            <List dense subheader={<ListSubheader>User</ListSubheader>}>
              <ListItemButton>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </List>
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: "1" }} />

      <Divider />
      <Box py={1} width="100%">
        <ColorThemeSwitch sx={{ display: "flex", justifyContent: "center" }} />
      </Box>
    </Drawer>
  );
}

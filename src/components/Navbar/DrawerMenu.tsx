import {
  Box,
  Drawer,
  IconButton,
  PaperProps,
  Divider,
  Avatar,
  Typography,
  Link as MUILink,
  List,
  ListSubheader,
  ListItemButton,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/users/selectors";
import { selectProjects } from "app/projects/selectors";
import { actions, selectIsOpen } from "app/widgets/drawerMenu";
import ColorThemeSwitch from "components/ColorThemeSwitch";
import ColoredAvatar from "components/ColoredAvatar";
import Link from "components/Link";

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

      <Box p={3} pb={2}>
        <Avatar
          src={user?.avatarURL}
          variant="circular"
          alt={user?.name}
          title="User avatar"
          sx={{ width: 56, height: 56 }}
        >
          {user?.name[0]}
        </Avatar>
        <Typography mt={1} fontWeight={500}>
          {user?.name}
        </Typography>

        {Boolean(user?.url) && (
          <MUILink
            target="_blank"
            rel="noopener"
            href={user?.url}
            underline="always"
            variant="subtitle2"
          >
            <OpenInNewIcon sx={{ fontSize: ".8rem" }} />
            {user?.url}
          </MUILink>
        )}
      </Box>
      <Divider />

      <Box display="flex" gap={1} pt={2} flexDirection="column">
        <List dense>
          <ListItemButton component={Link} onClick={onClose} to="/projects">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </List>

        <Box>{children}</Box>

        {projects.length > 0 && (
          <List dense subheader={<ListSubheader>All projects</ListSubheader>}>
            {projects.map((project) => (
              <ListItemButton
                key={project.id}
                component={Link}
                onClick={onClose}
                to={`/projects/${project.id}`}
              >
                <ListItemAvatar>
                  <ColoredAvatar oneLetter src={project.avatarThumbnailURL}>
                    {project.name}
                  </ColoredAvatar>
                </ListItemAvatar>
                <ListItemText primary={project.name} />
              </ListItemButton>
            ))}
          </List>
        )}

        {!!user && (
          <List dense subheader={<ListSubheader>User</ListSubheader>}>
            <ListItemButton component={Link} onClick={onClose} to="/profile">
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </List>
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

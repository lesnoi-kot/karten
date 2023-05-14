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
import { useQuery } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useUser } from "queries/user";
import { actions, selectIsOpen } from "store/widgets/drawerMenu";

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
  const { user } = useUser();

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
      keepMounted
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
            &nbsp;
            {user?.url}
          </MUILink>
        )}
      </Box>
      <Divider />

      <Box display="flex" gap={1} pt={2} flexDirection="column">
        {children}
      </Box>

      <Box sx={{ flexGrow: "1" }} />

      <Divider />
      <Box py={1} width="100%">
        <ColorThemeSwitch sx={{ display: "flex", justifyContent: "center" }} />
      </Box>
    </Drawer>
  );
}

type SectionProps = {
  children?: React.ReactNode;
};

function DrawerMainSection({ children }: SectionProps) {
  const dispatch = useAppDispatch();

  return (
    <List dense>
      <ListItemButton
        component={Link}
        onClick={() => {
          dispatch(actions.close());
        }}
        to="/projects"
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

      {children}
    </List>
  );
}

function DrawerProjectsSection({ children }: SectionProps) {
  const api = useAPI();
  const dispatch = useAppDispatch();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects({ includeBoards: false }),
  });

  if (projects.length === 0) {
    return null;
  }

  return (
    <List dense subheader={<ListSubheader>All projects</ListSubheader>}>
      {projects.map((project) => (
        <ListItemButton
          key={project.id}
          component={Link}
          onClick={() => {
            dispatch(actions.close());
          }}
          to={`/projects/${project.id}`}
        >
          <ListItemAvatar>
            <ColoredAvatar src={project.avatarThumbnailURL}>
              {project.name}
            </ColoredAvatar>
          </ListItemAvatar>
          <ListItemText primary={project.name} />
        </ListItemButton>
      ))}

      {children}
    </List>
  );
}

function DrawerUserSection({ children }: SectionProps) {
  const dispatch = useAppDispatch();

  return (
    <List subheader={<ListSubheader>User</ListSubheader>}>
      <ListItemButton
        component={Link}
        onClick={() => {
          dispatch(actions.close());
        }}
        to="/profile"
      >
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      {children}
    </List>
  );
}

type BaseMenuProps = {
  mainSectionChildren?: React.ReactNode;
  children?: React.ReactNode;
};

export function BaseMenu(props: BaseMenuProps) {
  return (
    <>
      <DrawerMainSection>{props.mainSectionChildren}</DrawerMainSection>
      {props.children}
      <DrawerProjectsSection />
      <DrawerUserSection />
    </>
  );
}

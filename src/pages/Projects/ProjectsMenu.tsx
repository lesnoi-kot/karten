import React from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

import Link from "components/Link";

export function ProjectsMenu() {
  const dispatch = useDispatch();

  return (
    <>
      <Box px={2} py={2} textAlign="center">
        <Typography variant="h5">Menu</Typography>
      </Box>

      <Divider />

      <List>
        <ListItem component={Link} to="/projects">
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Back to main" />
        </ListItem>
      </List>
      <Divider />
    </>
  );
}

export default React.memo(ProjectsMenu);

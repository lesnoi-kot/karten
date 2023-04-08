import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { Box, Typography, Link, styled, BoxProps, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/users/selectors";
import { getGitHubOAuthURL } from "services/auth";

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: "100%",
  height: "100%",
  paddingTop: "50px",
  backgroundImage:
    "linear-gradient(to right top, #a747d1, #9151da, #7659e2, #5461e7, #1267eb)",
}));

function Landing() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectCurrentUser);

  if (user) {
    return <Navigate to="/projects" />;
  }

  return (
    <Wrapper>
      <Helmet title="Karten" />
      <Box width="75%" maxWidth="700px" margin="0 auto">
        <Typography variant="h1" color="white">
          Karten
        </Typography>
        <Typography variant="h5" component="h2">
          A kanban-style, list-making application
        </Typography>
        <Typography mt={2} mb={3} variant="body1">
          Users can create their task boards with different columns and move the
          tasks between them. Typically columns include task statuses such as
          <i>To-do</i>, <i>In Progress</i>, <i>Done</i>. The tool can be used
          for personal and business purposes
        </Typography>

        <Button
          href={getGitHubOAuthURL()}
          endIcon={<GitHubIcon />}
          size="large"
          component={Link}
          variant="outlined"
          sx={{ color: "white" }}
        >
          Log in with GitHub
        </Button>
      </Box>
    </Wrapper>
  );
}

export default Landing;

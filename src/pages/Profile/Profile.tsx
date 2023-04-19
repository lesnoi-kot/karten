import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  Container,
  Button,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useAppSelector } from "app/hooks";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog";
import { selectCurrentUser } from "app/users/selectors";
import { GUEST_USER_ID } from "models/constants";
import makePage from "pages/makePageHOC";

function Profile() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet title="Profile | Karten" />
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h1"
          mt={2}
          mb={3}
          display="flex"
          alignItems="center"
        >
          Profile
        </Typography>

        <Paper
          sx={{ p: 3, mt: 3, display: "flex", gap: 3, flexDirection: "column" }}
        >
          <Box display="flex" gap={3}>
            <Avatar
              src={user.avatarURL}
              variant="circular"
              sx={{ width: 64, height: 64 }}
              alt="User avatar"
              title="User avatar"
            />
            <Box>
              <Typography variant="h4" component="h2">
                {user.name}
              </Typography>

              {!!user.url && (
                <Link
                  target="_blank"
                  rel="noopener"
                  href={user.url}
                  underline="always"
                  variant="subtitle2"
                >
                  <OpenInNewIcon sx={{ fontSize: ".8rem" }} />
                  &nbsp;
                  {user.url}
                </Link>
              )}
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                dispatch(apiActions.logOut());
              }}
            >
              Log Out
            </Button>

            {user.id !== GUEST_USER_ID && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  dispatch(
                    confirmDialogActions.showDialog({
                      title: "Warning",
                      text: "Do you want to delete your account?",
                      okAction: apiActions.deleteUser(),
                      okButtonText: "Delete",
                    }),
                  );
                }}
              >
                Delete Account
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default makePage(Profile);

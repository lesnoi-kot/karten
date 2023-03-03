import { Typography, Box, Button } from "@mui/material";

type Props = {
  title?: string;
  message?: string;
  retry?(): void;
};

function ErrorSplash({ message, title, retry }: Props) {
  return (
    // TODO themed bgcolor="lightblue" or lightcyan
    <Box textAlign="center" pt={2}>
      <Typography variant="h2" paragraph>
        {title ?? "Something went wrong"}
      </Typography>

      {retry && (
        <Typography variant="subtitle1" paragraph>
          Try to <Button onClick={retry}>reload</Button> the page
        </Typography>
      )}

      {message && (
        <Typography variant="caption" paragraph>
          <code>{message}</code>
        </Typography>
      )}

      <Typography fontSize="4rem">😵</Typography>
    </Box>
  );
}

export default ErrorSplash;

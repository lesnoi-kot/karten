import React from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Box, Typography } from "@mui/material";

import { FetchState } from "utils/types";

import { getBoardFetchState, getBoardFetchError } from "./slice";

function ErrorText({ error }: { error: any }) {
  let code: string = "";
  let message: string = "";

  if (error === "NOT_FOUND") {
    code = "404";
    message = "Not Found";
  } else {
    code = "Unknown error";
    message = "Try again";
  }

  return (
    <Box>
      {code && <Typography variant="h2">404</Typography>}
      {message && <Typography color="textSecondary">Not Found</Typography>}
    </Box>
  );
}

export default function Status() {
  const fetchState = useSelector(getBoardFetchState);
  const error = useSelector(getBoardFetchError);

  if (fetchState === FetchState.FULFILLED) {
    return null;
  }

  return (
    <Box textAlign="center">
      {fetchState === FetchState.PENDING && <CircularProgress />}
      {fetchState === FetchState.FAILED && <ErrorText error={error} />}
    </Box>
  );
}

import { Box, Typography } from "@mui/material";

import { selectFavoriteBoards } from "app/boards/selectors";
import { useAppSelector } from "app/hooks";

import BoardPreviewList from "components/Board/BoardPreviewList";

function StarredBoards() {
  const boards = useAppSelector(selectFavoriteBoards);

  if (boards.length === 0) {
    return null;
  }

  return (
    <Box mb={3}>
      <Typography variant="h4" component="h2" mt={2} mb={3}>
        Starred boards
      </Typography>
      <BoardPreviewList ids={boards} />
    </Box>
  );
}

export default StarredBoards;

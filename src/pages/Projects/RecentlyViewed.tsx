import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { selectLastViewedBoards } from "app/boards/selectors";
import { useAppSelector } from "app/hooks";

import BoardPreviewList from "components/Board/BoardPreviewList";

function RecentlyViewed() {
  const boards = useAppSelector(selectLastViewedBoards);

  if (boards.length === 0) {
    return null;
  }

  return (
    <Box mb={4} mt={4}>
      <Typography
        variant="h4"
        component="h2"
        mb={3}
        display="flex"
        alignItems="center"
      >
        Recently viewed
      </Typography>

      <BoardPreviewList ids={boards} />
    </Box>
  );
}

export default RecentlyViewed;

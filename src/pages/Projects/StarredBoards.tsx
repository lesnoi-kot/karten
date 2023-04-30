import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import BoardPreviewList from "components/Board/BoardPreviewList";

function StarredBoards() {
  const api = useAPI();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects", { includeBoards: true }],
    queryFn: () => api.getProjects({ includeBoards: true }),
  });

  const boards = projects
    .flatMap((project) => project.boards ?? [])
    .filter((board) => board.favorite);

  if (boards.length === 0) {
    return null;
  }

  return (
    <Box mb={3}>
      <Typography variant="h4" component="h2" mt={2} mb={3}>
        Starred boards
      </Typography>
      <BoardPreviewList boards={boards} />
    </Box>
  );
}

export default StarredBoards;

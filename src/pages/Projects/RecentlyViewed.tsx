import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";
import BoardPreviewList from "components/Board/BoardPreviewList";
import { compareDateStrings } from "utils/selectors";

function RecentlyViewed() {
  const api = useAPI();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects", { includeBoards: true }],
    queryFn: () => api.getProjects({ includeBoards: true }),
  });

  const boards = projects
    .flatMap((project) => project.boards ?? [])
    .sort((a, b) => compareDateStrings(b.dateLastViewed, a.dateLastViewed))
    .slice(0, 4);

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

      <BoardPreviewList boards={boards} />
    </Box>
  );
}

export default RecentlyViewed;

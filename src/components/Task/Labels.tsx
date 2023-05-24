import { Box, Stack, Chip, Typography } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import SquareIcon from "@mui/icons-material/Square";

import { useTask } from "queries/tasks";
import { Task } from "models/types";

function Labels({ task }: { task: Task }) {
  const {
    deleteLabel: { mutate: deleteLabel },
  } = useTask(task.id, { queryEnabled: false });
  const { labels } = task;

  if (labels.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack alignItems="center" flexDirection="row" gap={1}>
        <LabelIcon />
        <Typography variant="h6" component="h2">
          Labels
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} pt={1}>
        {labels.map((label) => (
          <Chip
            icon={<SquareIcon fontSize="small" sx={{ fill: label.color }} />}
            key={label.id}
            label={label.name}
            variant="outlined"
            onDelete={() => {
              deleteLabel(label.id);
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default Labels;

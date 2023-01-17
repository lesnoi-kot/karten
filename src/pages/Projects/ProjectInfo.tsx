import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";

import { selectProjectById } from "app/projects/selectors";
import { selectBoardsIdsByProjectId } from "app/boards/selectors";
import { useAppSelector } from "app/hooks";
import { ID } from "models/types";
import { buildURL } from "utils/routes";

import BoardPreviewList from "components/Board/BoardPreviewList";
import Link from "components/Link";

function ProjectInfo({ id }: { id: ID }) {
  const project = useAppSelector((state) => selectProjectById(state, id));
  const boards = useAppSelector((state) =>
    selectBoardsIdsByProjectId(state, id),
  );

  if (!project) {
    return null;
  }

  return (
    <Card elevation={1} id={`project-${id}`}>
      <CardHeader
        avatar={<Avatar variant="rounded">{project.name[0]}</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={project.name}
        titleTypographyProps={{
          variant: "h5",
          component: "h3",
        }}
      />
      <CardContent>
        <Link
          to={buildURL("pages:project", { projectId: id })}
          underline="none"
        >
          <Typography variant="h6" component="h3" gutterBottom>
            {project.name}
          </Typography>
        </Link>
        <BoardPreviewList ids={boards} showComposer projectId={id} />
      </CardContent>
    </Card>
  );
}

export default ProjectInfo;

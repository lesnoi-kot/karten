import { useMemo, useRef, memo } from "react";
import { generatePath } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { selectProjectById } from "app/projects/index";
import { selectBoardsIdsByProjectId } from "app/boards/selectors";
import { actions as apiActions } from "app/apiInteraction";
import { actions as confirmDialogActions } from "app/widgets/confirmDialog/slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ID } from "models/types";
import { ENTITY_COLOR } from "models/constants";

import BoardPreviewList from "components/Board/BoardPreviewList";
import useToggle from "components/hooks/useToggle";
import Link from "components/Link";

function ProjectInfo({ id }: { id: ID }) {
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);
  const project = useAppSelector((state) => selectProjectById(state, id));
  const boards = useAppSelector((state) =>
    selectBoardsIdsByProjectId(state, id),
  );
  const [menuIsVisible, showMenu, hideMenu] = useToggle(false);

  const avatarBgColor = useMemo(() => {
    if (project) {
      return Object.values(ENTITY_COLOR)[
        project.name[0].charCodeAt(0) % Object.keys(ENTITY_COLOR).length
      ];
    }
  }, [project]);

  if (!project) {
    return null;
  }

  return (
    <Card
      elevation={0}
      id={`project-${id}`}
      sx={{ background: (theme) => theme.palette.surfaces[50] }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={project.avatarThumbnailURL}
            variant="rounded"
            sx={{ bgcolor: avatarBgColor }}
          >
            {project.name[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" ref={menuRef} onClick={showMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link to={generatePath("/projects/:id", { id })} color="text.primary">
            {project.name}
          </Link>
        }
        titleTypographyProps={{
          variant: "h6",
          component: "h3",
        }}
      />
      <CardContent>
        <BoardPreviewList ids={boards} showComposer projectId={id} />
      </CardContent>

      <Menu
        anchorEl={menuRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={menuIsVisible}
        onClose={hideMenu}
      >
        {boards.length > 0 && (
          <MenuItem
            onClick={() => {
              dispatch(
                confirmDialogActions.showDialog({
                  okAction: apiActions.clearProject(id),
                  okButtonText: "yes",
                  title: "Warning",
                  text: `Clear project "${project.name}"?`,
                }),
              );
              hideMenu();
            }}
          >
            Clear
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            dispatch(
              confirmDialogActions.showDialog({
                okAction: apiActions.deleteProject(id),
                okButtonText: "yes",
                title: "Warning",
                text: `Delete project "${project.name}"?`,
              }),
            );
            hideMenu();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}

export default memo(ProjectInfo);

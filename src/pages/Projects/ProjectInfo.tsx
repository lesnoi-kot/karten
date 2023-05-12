import { useRef, memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { actions as confirmDialogActions } from "store/widgets/confirmDialog";
import { useAppDispatch } from "store/hooks";
import { Project } from "models/types";
import { showSnackbar } from "store/snackbars";

import BoardPreviewList from "components/Board/BoardPreviewList";
import useToggle from "components/hooks/useToggle";
import Link from "components/Link";
import ColoredAvatar from "components/ColoredAvatar";
import { useClearProject, useDeleteProject } from "store/hooks/projects";

function ProjectInfo({ project }: { project: Project }) {
  const { id, boards = [] } = project;
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);
  const [menuIsVisible, showMenu, hideMenu] = useToggle(false);

  const { mutate: clearProject } = useClearProject({
    projectId: project.id,
    onSuccess() {
      dispatch(
        showSnackbar({
          message: `Project "${project.name}" has been cleared`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());
    },
  });

  const { mutate: deleteProject } = useDeleteProject({
    projectId: project.id,
    onSuccess() {
      dispatch(
        showSnackbar({
          message: `Project "${project.name}" has been deleted`,
          type: "info",
        }),
      );
      dispatch(confirmDialogActions.closeDialog());
    },
  });

  return (
    <Card
      elevation={0}
      id={`project-${id}`}
      sx={{ background: (theme) => theme.palette.surfaces[50] }}
    >
      <CardHeader
        avatar={
          <ColoredAvatar src={project.avatarThumbnailURL} variant="rounded">
            {project.name}
          </ColoredAvatar>
        }
        action={
          <IconButton aria-label="settings" ref={menuRef} onClick={showMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link to={`/projects/${id}`} color="text.primary">
            {project.name}
          </Link>
        }
        titleTypographyProps={{
          variant: "h6",
          component: "h3",
        }}
      />
      <CardContent>
        <BoardPreviewList boards={boards} showComposer projectId={id} />
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
                  okCallback: clearProject,
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
                okCallback: deleteProject,
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

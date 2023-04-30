import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, IconButton, Typography, SxProps, Theme } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Board } from "models/types";
import { useAPI } from "context/APIProvider";

import { PreviewCard } from "components/ui/PreviewCard";

import styles from "./styles.module.css";

type Props = {
  board: Board;
  showFavoriteButton?: boolean;
};

const sxCardToolbar: SxProps<Theme> = {
  display: "flex",
  position: "absolute",
  bottom: 0,
  right: 0,
  width: "100%",
  justifyContent: "flex-end",
};

function BoardPreview({ board, showFavoriteButton = true }: Props) {
  const { id, name } = board;
  const api = useAPI();
  const queryClient = useQueryClient();

  const setFavorite = useMutation({
    mutationFn: () =>
      board?.favorite ? api.unfavoriteBoard(id) : api.favoriteBoard(id),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["projects", { includeBoards: true }],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", { projectId: board?.projectId }],
      });
    },
  });

  return (
    <PreviewCard
      className={styles.previewCard}
      color={board.color}
      coverURL={board.coverURL}
    >
      <Typography>{name}</Typography>

      <Box className={styles.toolbar} sx={sxCardToolbar}>
        {showFavoriteButton && (
          <FavoriteButton value={board.favorite} onClick={setFavorite.mutate} />
        )}
      </Box>
    </PreviewCard>
  );
}

function FavoriteButton({
  onClick,
  value,
}: {
  onClick: VoidFunction;
  value: boolean;
}) {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      disableRipple
      size="small"
      title={
        value
          ? "Click to unstar this board. It will be removed from your starred list."
          : "Click to star this board. It will be added to your starred list."
      }
    >
      {value ? (
        <FavoriteIcon fontSize="small" htmlColor="tomato" />
      ) : (
        <FavoriteBorderOutlinedIcon
          fontSize="small"
          htmlColor="white"
          sx={{
            "&:hover": {
              color: "tomato",
            },
          }}
        />
      )}
    </IconButton>
  );
}

export default BoardPreview;

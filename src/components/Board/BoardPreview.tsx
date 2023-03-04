import { useMutation } from "react-query";
import { Box, IconButton, Typography, SxProps, Theme } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { actions as apiActions } from "app/apiInteraction";
import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";
import { useAPI } from "context/APIProvider";

import Stub from "components/Stub";
import { PreviewCard } from "components/ui/PreviewCard";

import styles from "./styles.module.css";

type Props = {
  id: ID;
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

function BoardPreview({ id, showFavoriteButton = true }: Props) {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const board = useAppSelector((state) => selectBoard(state, id));

  const setFavorite = useMutation(
    () => (board?.favorite ? api.unfavoriteBoard(id) : api.favoriteBoard(id)),
    {
      onSuccess: () => {
        dispatch(apiActions.boardRequest(id));
      },
    },
  );

  if (!board) {
    return <Stub />;
  }

  const { name } = board;

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

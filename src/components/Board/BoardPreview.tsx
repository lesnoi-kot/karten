import { IconButton, Typography } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { useAppSelector } from "app/hooks";
import { ID } from "models/types";
import { selectBoard } from "app/boards/selectors";

import Stub from "components/Stub";
import { PreviewCard } from "components/ui/PreviewCard";

type Props = {
  id: ID;
  hideFavoriteButton?: boolean;
};

const favButtonSx = {
  position: "absolute",
  bottom: 0,
  right: 0,
};

function BoardPreview({ id, hideFavoriteButton }: Props) {
  const board = useAppSelector((state) => selectBoard(state, id));

  if (!board) {
    return <Stub />;
  }

  const { name } = board;

  return (
    <PreviewCard color={board.color} coverURL={board.coverURL}>
      <Typography fontWeight={700}>{name}</Typography>

      {!hideFavoriteButton && (
        <IconButton
          disableRipple
          onClick={(e) => {
            e.stopPropagation();
          }}
          size="small"
          sx={favButtonSx}
        >
          <FavoriteBorderOutlinedIcon fontSize="small" htmlColor="white" />
        </IconButton>
      )}
    </PreviewCard>
  );
}

export default BoardPreview;

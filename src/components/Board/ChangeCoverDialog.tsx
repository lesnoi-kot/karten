import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { actions as apiActions } from "app/apiInteraction";
import { ID, Board } from "models/types";
import BoardCoverSelect, {
  OnChangeArg,
} from "components/Board/BoardCoverSelect";
import { useRequest } from "app/apiInteraction/hooks";
import { hexColorToNumber } from "utils/color";

type Props = {
  open: boolean;
  onClose: () => void;
  board: Board;
};

export default function ChangeCoverDialog({ open, onClose, board }: Props) {
  const [color, setColor] = useState<string>(board.color);
  const [coverURL, setCoverURL] = useState<string | null>(board.coverURL);
  const [coverId, setCoverId] = useState<ID | null>(null);

  const { load, isLoading } = useRequest(apiActions.updateBoardRequest, {
    onSuccess() {
      onClose();
    },
  });

  const onChange = (data: OnChangeArg) => {
    if ("color" in data) {
      setColor(data.color);
      setCoverURL(null);
      setCoverId(null);
    } else {
      setCoverURL(data.coverURL);
      setCoverId(data.coverId);
    }
  };

  const onSubmit = () => {
    if (coverId) {
      load({
        id: board.id,
        coverId: coverId,
      });
    } else {
      load({
        id: board.id,
        color: hexColorToNumber(color),
        coverId: null,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change board cover</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <BoardCoverSelect
          color={color}
          coverURL={coverURL}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <LoadingButton loading={isLoading} onClick={onSubmit} autoFocus>
          ok
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

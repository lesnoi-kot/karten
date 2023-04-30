import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useAPI } from "context/APIProvider";
import { ID, Board } from "models/types";
import BoardCoverSelect, {
  OnChangeArg,
} from "components/Board/BoardCoverSelect";
import { hexColorToNumber } from "utils/color";

type Props = {
  open: boolean;
  onClose: () => void;
  board: Board;
};

export default function ChangeCoverDialog({ open, onClose, board }: Props) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const [color, setColor] = useState<string>(board.color);
  const [coverURL, setCoverURL] = useState<string | null>(board.coverURL);
  const [coverId, setCoverId] = useState<ID | null>(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: api.editBoard.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", { boardId: board.id }],
      });

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
      mutate({
        id: board.id,
        coverId: coverId,
      });
    } else {
      mutate({
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

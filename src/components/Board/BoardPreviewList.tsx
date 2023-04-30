import { Stack } from "@mui/material";

import { ID, Board } from "models/types";

import Link from "components/Link";

import BoardPreview from "./BoardPreview";
import NewBoardStub from "./NewBoardStub";

type Props = {
  boards: Board[];
  showComposer?: boolean;
  projectId?: ID;
};

function BoardPreviewList({ boards, showComposer = false, projectId }: Props) {
  return (
    <Stack direction="row" gap={2} width="100%" flexWrap="wrap">
      {boards.map((board) => (
        <Link key={board.id} to={`/boards/${board.id}`} underline="none">
          <BoardPreview board={board} />
        </Link>
      ))}

      {showComposer && projectId && <NewBoardStub projectId={projectId} />}
    </Stack>
  );
}

export default BoardPreviewList;

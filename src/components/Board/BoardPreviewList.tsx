import { Stack } from "@mui/material";

import { ID } from "models/types";

import Link from "components/Link";

import BoardPreview from "./BoardPreview";
import NewBoardStub from "./NewBoardStub";
import { generatePath } from "react-router-dom";

type Props = {
  ids: ID[];
  showComposer?: boolean;
  projectId?: ID;
};

function BoardPreviewList({ ids, showComposer = false, projectId }: Props) {
  return (
    <Stack direction="row" gap={2} width="100%" flexWrap="wrap">
      {ids.map((boardId) => (
        <Link
          key={boardId}
          to={generatePath("/boards/:id", { id: boardId })}
          underline="none"
        >
          <BoardPreview id={boardId} />
        </Link>
      ))}

      {showComposer && projectId && <NewBoardStub projectId={projectId} />}
    </Stack>
  );
}

export default BoardPreviewList;

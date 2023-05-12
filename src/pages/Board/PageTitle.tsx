import { Helmet } from "react-helmet";

import { ID, Board } from "models/types";
import { useTask } from "store/hooks/tasks";

type Props = {
  board: Board;
  selectedTaskId: ID | null;
};

export default function PageTitle({ board, selectedTaskId }: Props) {
  if (selectedTaskId) {
    return <PageTitleWithTask board={board} selectedTaskId={selectedTaskId} />;
  }

  return (
    <Helmet>
      <title>{board.name ? `${board.name} | ` : ""}Karten</title>
    </Helmet>
  );
}

function PageTitleWithTask({
  board,
  selectedTaskId,
}: Props & { selectedTaskId: ID }) {
  const {
    query: { data: task },
  } = useTask(selectedTaskId);

  return (
    <Helmet>
      <title>
        {task?.name ? `${task.name} | ` : ""}
        {board.name ? `${board.name} | ` : ""}Karten
      </title>
    </Helmet>
  );
}

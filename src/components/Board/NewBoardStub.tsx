import AddIcon from "@mui/icons-material/Add";

import { ID } from "models/types";
import { PreviewCardIconButton } from "components/ui/PreviewCard";
import { useAppDispatch } from "store/hooks";
import { actions } from "store/widgets/newBoardDialog";

export default function NewBoardStub({ projectId }: { projectId: ID }) {
  const dispatch = useAppDispatch();

  const showDialog = () => {
    dispatch(actions.showDialog(projectId));
  };

  return (
    <PreviewCardIconButton onClick={showDialog} title="Create new board">
      <AddIcon color="primary" fontSize="medium" />
    </PreviewCardIconButton>
  );
}

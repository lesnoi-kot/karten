import React, { useRef } from "react";
import { Grid } from "@mui/material";

import * as models from "models/types";

type ListSlotProps = {
  children: React.ReactNode;
  index: number;
  draggingTaskId?: models.ID | null;

  onHover?: (id: models.ID, index: number) => void;
  onDragStart?: (id: models.ID, index: number) => void;
  onDragEnd?: (id: models.ID, index: number) => void;
};

// https://react-dnd.github.io/react-dnd/examples/sortable/simple

const ListSlot = ({ children }: ListSlotProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Grid ref={ref} item xs={12}>
      {children}
    </Grid>
  );
};

export default React.memo(ListSlot);

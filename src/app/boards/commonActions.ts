import { createAction } from "@reduxjs/toolkit";

import { ID } from "models/types";

export const boardDeleted = createAction<ID>("boards/boardDeleted");

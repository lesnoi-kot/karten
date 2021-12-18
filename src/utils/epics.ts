import { PayloadAction } from "@reduxjs/toolkit";

export function actionPayloadNotEmptyArray<T>(action: PayloadAction<Array<T>>) {
  return action.payload.length !== 0;
}

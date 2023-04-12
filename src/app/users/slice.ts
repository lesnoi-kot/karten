import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, User } from "models/types";

export type UsersMap = Record<ID, User>;

export type UsersSlice = {
  items: UsersMap;
  userId: ID | null; // Current user
};

const initialState: UsersSlice = {
  items: {},
  userId: null,
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "users",
  initialState,
  reducers: {
    userLoggedIn: (state, { payload: user }: PayloadAction<User>) => {
      state.items[user.id] = user;
      state.userId = user.id;
    },
    userAdded: (state, { payload: user }: PayloadAction<User>) => {
      state.items[user.id] = user;
    },
    userLoggedOut: (state) => {
      state.userId = null;
    },
  },
});

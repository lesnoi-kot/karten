import { createSlice } from "@reduxjs/toolkit";

type DrawerMenuSlice = {
  isOpen: boolean;
};

const initialState: DrawerMenuSlice = {
  isOpen: false,
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "drawerMenu",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

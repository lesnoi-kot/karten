import { createAction } from "@reduxjs/toolkit";

type PageMeta = {
  name?: string;
};

export const pageLoaded = createAction<PageMeta>("PAGE_LOADED");
export const pageUnloaded = createAction<PageMeta>("PAGE_UNLOADED");

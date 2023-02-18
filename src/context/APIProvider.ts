import React from "react";
import { DataStore } from "services/api";

export const APIContext = React.createContext<DataStore | null>(null);
export const useAPI = () => React.useContext(APIContext)!;

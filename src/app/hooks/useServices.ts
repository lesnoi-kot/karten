import { DataStore } from "services/api";
import { apiService } from "../services";

type InjectedServices = {
  apiService: DataStore;
};

export const useServices = (): InjectedServices => {
  return { apiService };
};

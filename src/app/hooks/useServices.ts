import { API } from "services/api";
import { apiService } from "../services";

type InjectedServices = {
  apiService: API;
};

export const useServices = (): InjectedServices => {
  return { apiService };
};

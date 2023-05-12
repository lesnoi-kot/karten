import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/APIProvider";

export function useUser() {
  const api = useAPI();
  const queryClient = useQueryClient();

  const query = useQuery({
    retry: 1,
    refetchInterval: false,
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(),
  });

  const { mutate: logOut } = useMutation({
    mutationFn: () => api.logOut(),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: () => api.deleteUser(),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const { data: user, isLoading, isSuccess } = query;
  return {
    user,
    isLoading,
    isSuccess,
    logOut() {
      logOut();
    },
    deleteUser() {
      deleteUser();
    },
  };
}

export function useLogInAsGuest() {
  const api = useAPI();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => api.logInAsGuest(),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  return {
    isLoading,
    logIn: () => {
      mutate();
    },
  };
}

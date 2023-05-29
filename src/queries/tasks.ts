import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Draft, produce } from "immer";

import { useAPI } from "context/APIProvider";
import { Task, ID, Label } from "models/types";
import { useAppDispatch } from "store/hooks";
import { showSnackbar } from "store/snackbars";

import { useOptimisticBoardMutation } from "./boards";

type UseTaskArgs = {
  queryEnabled?: boolean;
  initialData?: Task;
};

export const taskKeys = {
  task(taskId: ID) {
    return ["tasks", { taskId }];
  },
};

export function useTask(taskId: ID, args: UseTaskArgs = {}) {
  const { queryEnabled = true, initialData } = args;
  const dispatch = useAppDispatch();
  const api = useAPI();
  const queryClient = useQueryClient();
  const updateBoard = useOptimisticBoardMutation();
  const updateTask = useOptimisticTaskMutation(taskId);
  const queryKey = taskKeys.task(taskId);

  const query = useQuery({
    initialData,
    enabled: queryEnabled,
    queryFn: () => api.getTask(taskId),
    queryKey,
    retry: 0,
    refetchInterval: false,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Task>) => api.editTask({ ...data, id: taskId }),
    onMutate(data) {
      queryClient.setQueryData<Task>(queryKey, (task) =>
        produce(task, (draft) => {
          draft && Object.assign(draft, data);
        }),
      );
    },
    onSuccess(updatedTask) {
      queryClient.setQueryData<Task>(queryKey, updatedTask);
    },
  });

  const deletion = useMutation({
    mutationFn: () => api.deleteTask(taskId),
    onMutate() {
      queryClient.removeQueries({ queryKey });

      updateBoard((draft) => {
        draft.deleteTask(taskId);
      });
    },
  });

  const copy = useMutation({
    mutationFn: () => {
      const task = query.data;

      if (!task) {
        return Promise.reject(new Error("Task to copy is null"));
      }

      return api.addTask({
        taskListId: task.taskListId,
        name: task.name,
        text: task.text,
        dueDate: task.dueDate,
        position: Date.now(),
      });
    },
  });

  const attach = useMutation({
    mutationFn: (fileId: ID) =>
      api.attachFileToTask({ id: taskId, filesId: [fileId] }),
    onSuccess() {
      dispatch(
        showSnackbar({
          message: `Attachments has been uploaded`,
          type: "success",
        }),
      );
    },
  });

  const startTracking = useMutation({
    mutationFn: () => api.startTaskTracking(taskId),
    onSuccess() {
      invalidate();
    },
  });

  const stopTracking = useMutation({
    mutationFn: () => api.stopTaskTracking(taskId),
    onSuccess() {
      invalidate();
    },
  });

  const addLabel = useMutation({
    mutationFn: (label: Label) =>
      api.addLabelToTask({ taskId, labelId: label.id }),
    onMutate(label) {
      updateTask((task) => {
        task.addLabel(label);
      });
    },
    onSuccess() {
      invalidate();
    },
  });

  const deleteLabel = useMutation({
    mutationFn: (labelId: number) =>
      api.deleteLabelFromTask({ taskId, labelId }),
    onMutate(labelId) {
      updateTask((task) => {
        task.deleteLabel(labelId);
      });
    },
    onSuccess() {
      invalidate();
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return {
    query,
    mutation,
    deletion,
    copy,
    attach,
    startTracking,
    stopTracking,
    addLabel,
    deleteLabel,
    invalidate,
  };
}

type TaskDraftMutator = (taskDraft: Draft<Task>) => void;

export function useOptimisticTaskMutation(taskId: ID) {
  const queryClient = useQueryClient();

  return function (mutation: TaskDraftMutator) {
    queryClient.setQueryData<Task>(taskKeys.task(taskId), (task) =>
      task ? produce(task, mutation) : task,
    );
  };
}

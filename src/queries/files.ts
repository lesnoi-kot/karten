import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { showSnackbar } from "store/snackbars";
import { useAPI } from "context/APIProvider";
import { useAppDispatch } from "store/hooks";
import { APIError } from "services/api";
import { ID, KartenFile } from "models/types";

export function useFileUploader() {
  const dispatch = useAppDispatch();
  const api = useAPI();

  const mutation = useMutation({
    mutationFn: (file: File) => api.uploadFile({ file }),
    onSuccess(data, file) {
      dispatch(
        showSnackbar({
          type: "success",
          message: `File "${file.name}" is successfully uploaded`,
        }),
      );
    },
    onError(error: APIError, file) {
      dispatch(
        showSnackbar({
          type: "error",
          message: `File "${file.name}" upload error (${error.message})`,
        }),
      );
    },
    onMutate(file) {
      dispatch(
        showSnackbar({
          type: "info",
          message: `File "${file.name}" is uploading...`,
        }),
      );
    },
  });

  return mutation;
}

export function useFileDeleter(
  options?: UseMutationOptions<void, APIError, ID>,
) {
  const dispatch = useAppDispatch();
  const api = useAPI();

  const mutation = useMutation({
    mutationFn: (fileId: ID) => api.deleteFile(fileId),
    onSuccess(data, variables, context) {
      dispatch(
        showSnackbar({
          type: "success",
          message: `File was successfully deleted`,
        }),
      );

      options?.onSuccess?.(data, variables, context);
    },
    onError(error: APIError, variables, context) {
      dispatch(
        showSnackbar({
          type: "error",
          message: `File delete error (${error.message})`,
        }),
      );

      options?.onError?.(error, variables, context);
    },
  });

  return mutation;
}

export function useFileUploaderOnPaste(cb: (files: KartenFile[]) => void) {
  const { mutateAsync: uploadFile } = useFileUploader();

  async function onPaste(e: React.ClipboardEvent<HTMLElement>) {
    const files = Array.from(e.clipboardData.files).map((file) =>
      uploadFile(file),
    );

    const uploadedFiles = await Promise.all(files);
    cb(uploadedFiles);
  }

  return { onPaste };
}

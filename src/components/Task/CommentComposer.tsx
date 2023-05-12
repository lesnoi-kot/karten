import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useAPI } from "context/APIProvider";
import { ID } from "models/types";
import { blurOnEscape } from "utils/events";
import UserAvatar from "components/UserAvatar";

function CommentComposer({ taskId }: { taskId: ID }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const queryClient = useQueryClient();
  const api = useAPI();

  const { mutate: addComment, isLoading } = useMutation({
    mutationFn: () => api.addComment({ taskId, text }),
    onSuccess() {
      setText("");
      setFocused(false);

      queryClient.invalidateQueries({ queryKey: ["tasks", { taskId }] });
    },
  });

  return (
    <Stack direction="row" gap={1}>
      <UserAvatar />
      <Box flexGrow="1">
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={blurOnEscape}
          multiline
          fullWidth
          size="small"
          margin="none"
          placeholder="Write a comment"
          minRows={focused ? 2 : 0}
          variant="outlined"
          onFocus={() => setFocused(true)}
          onBlur={() => !text && setFocused(false)}
        />
        {focused && (
          <>
            <Box mt={1} />
            <LoadingButton
              loading={isLoading}
              onClick={() => {
                addComment();
              }}
              disabled={text.trim() === ""}
              variant="outlined"
            >
              Save
            </LoadingButton>
          </>
        )}
      </Box>
    </Stack>
  );
}

export default CommentComposer;

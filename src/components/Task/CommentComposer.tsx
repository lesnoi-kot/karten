import { useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ID } from "models/types";
import { actions as apiActions } from "app/apiInteraction";
import { useRequest } from "app/apiInteraction/hooks";
import { blurOnEscape } from "utils/events";
import UserAvatar from "components/UserAvatar";

type Props = {
  taskId: ID;
};

function CommentComposer({ taskId }: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const { load: addComment, isLoading } = useRequest(
    apiActions.addCommentRequest,
    {
      onSuccess() {
        setText("");
        setFocused(false);
      },
    },
  );

  const onSubmit = () => {
    addComment({ taskId, text });
  };

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
              onClick={onSubmit}
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

import { useQuery, useMutation } from "react-query";
import { Box, Stack, BoxProps } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { useAPI } from "context/APIProvider";
import { ColorName, ID } from "models/types";
import { UploadImage } from "services/api";
import { ENTITY_COLOR } from "models/constants";
import { ColorTags } from "components/ui/ColorTag";
import { useFilePicker } from "components/ui/FileInput/FileInput";
import BoardCoverPreview from "components/Board/BoardCoverPreview";

export type OnChangeArg = { color: string } | { coverId: ID; coverURL: string };

type Props = {
  onChange(data: OnChangeArg): void;
  color: string;
  coverURL: string | null;
};

export default function BoardCoverSelect({ color, coverURL, onChange }: Props) {
  const api = useAPI();
  const { FileInput, clearFile } = useFilePicker();

  const { data: covers } = useQuery("boards.covers", () =>
    api.getBoardCovers(),
  );

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation({
    mutationFn: (arg: UploadImage) => api.uploadImage(arg),
    onSuccess: (uploadedImage) => {
      onChange({ coverId: uploadedImage.id, coverURL: uploadedImage.url });
    },
  });

  const setBoardColor = (color: ColorName) => {
    onChange({ color: ENTITY_COLOR[color] });
    clearFile();
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" gap={1}>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <ColorTags onClick={setBoardColor} />
          </Stack>

          <Stack direction="row" gap={1}>
            {(covers ?? []).map((cover) => (
              <CoverTag
                key={cover.id}
                coverURL={cover.url}
                onClick={() => {
                  onChange({ coverId: cover.id, coverURL: cover.url });
                }}
              />
            ))}

            <FileInput
              label="Select file"
              buttonProps={{
                startIcon: <FileUploadIcon />,
                loading: isUploadingImage,
                variant: "outlined",
                size: "small",
              }}
              accept="image/png, image/jpeg, image/webp"
              onChange={(files) => {
                if (files[0]) {
                  uploadImage({ file: files[0], makeThumbnail: false });
                }
              }}
            />
          </Stack>
        </Box>

        <BoardCoverPreview color={color} coverURL={coverURL} />
      </Box>
    </Box>
  );
}

function CoverTag({ coverURL, ...props }: BoxProps & { coverURL: string }) {
  return (
    <Box width="64px" height="40px" {...props}>
      <img width="100%" src={coverURL} alt="Preview" />
    </Box>
  );
}

import prettyBytes from "pretty-bytes";
import {
  Link,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import TheatersIcon from "@mui/icons-material/Theaters";
import ArticleIcon from "@mui/icons-material/Article";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

import { ID, KartenFile } from "models/types";

const avatarSx = { width: 50, height: 50 };

type Props = {
  attachments: KartenFile[];
  deletable: boolean;
  onDelete(fileId: ID): void;
};

export default function Attachments({
  attachments,
  deletable,
  onDelete,
}: Props) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <List disablePadding>
      {attachments.map((file) => (
        <ListItem key={file.id}>
          <ListItemAvatar sx={{ paddingRight: 1 }}>
            <Avatar variant="square" sx={avatarSx} src={file.url}>
              {getFileIcon(file.mimeType)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Link href={file.url} target="_blank">
                {file.name}
              </Link>
            }
            secondary={
              <Stack direction="row" gap={1}>
                <Typography fontSize="inherit" color="inherit">
                  {prettyBytes(file.size)}
                </Typography>
                {deletable && (
                  <>
                    <Typography>•</Typography>
                    <Link
                      component="button"
                      onClick={() => {
                        onDelete(file.id);
                      }}
                    >
                      Delete
                    </Link>
                  </>
                )}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("audio/")) {
    return <AudioFileIcon />;
  }

  if (mimeType.startsWith("video/")) {
    return <TheatersIcon />;
  }

  if (mimeType.startsWith("text/")) {
    return <ArticleIcon />;
  }

  if (mimeType.startsWith("application/")) {
    return <MiscellaneousServicesIcon />;
  }

  return null;
}

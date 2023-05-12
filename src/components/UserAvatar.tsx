import { Avatar, AvatarProps } from "@mui/material";

import { useUser } from "store/hooks/user";

export default function UserAvatar(props: AvatarProps) {
  const { user } = useUser();

  return (
    <Avatar src={user?.avatarURL} {...props}>
      {user?.name?.[0] ?? ""}
    </Avatar>
  );
}

import { Avatar, AvatarProps } from "@mui/material";

import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/users/selectors";

export default function UserAvatar(props: AvatarProps) {
  const user = useAppSelector(selectCurrentUser);

  return (
    <Avatar src={user?.avatarURL} {...props}>
      {user?.name?.[0] ?? ""}
    </Avatar>
  );
}

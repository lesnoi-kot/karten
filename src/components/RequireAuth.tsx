import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/users/selectors";

type Props = {
  children: ReactNode;
  redirectTo: string;
};

export default function RequireAuth({ children, redirectTo }: Props) {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}

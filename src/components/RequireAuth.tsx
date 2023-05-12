import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useUser } from "store/hooks/user";

type Props = {
  children: ReactNode;
  redirectTo: string;
};

export default function RequireAuth({ children, redirectTo }: Props) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}

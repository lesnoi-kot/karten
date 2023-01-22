import { Link as ReactRouterLink } from "react-router-dom";
import MUILink, { LinkProps } from "@mui/material/Link";

type Props = LinkProps & {
  to: string;
};

export default function Link({ to, ...props }: Props) {
  return <MUILink component={ReactRouterLink} {...props} to={to} />;
}

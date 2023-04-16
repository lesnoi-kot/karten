import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import MUILink, { LinkProps } from "@mui/material/Link";

type Props = LinkProps & ReactRouterLinkProps;

export default function Link({ to, ...props }: Props) {
  return <MUILink component={ReactRouterLink} {...props} to={to} />;
}

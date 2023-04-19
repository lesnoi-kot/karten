import { forwardRef } from "react";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import MUILink, { LinkProps } from "@mui/material/Link";

type Props = LinkProps & Pick<ReactRouterLinkProps, "to">;

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(props, ref) {
  return <MUILink ref={ref} {...props} component={ReactRouterLink} />;
});

export default Link;

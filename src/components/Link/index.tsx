import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import MUILink, { LinkProps } from "@mui/material/Link";

import { buildURL } from "utils/routes";

type Props = LinkProps & {
  to?: string;
  route?: string;
  params?: any;
};

export default function Link(props: Props) {
  let { to = "" } = props;

  if (props.route) {
    to = buildURL(props.route, props.params);
  }

  return <MUILink component={ReactRouterLink} {...props} to={to} />;
}

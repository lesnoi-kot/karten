import { memo } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = BoxProps & {
  html: string;
};

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: "100%",

  "& p, pre": {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    lineHeight: 1,
  },
  "& code": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  "& pre": {
    overflow: "scroll",
  },
  "& img": {
    maxWidth: "100%",
  },

  "& h1": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    ...theme.typography.h3,
  },
  "& h2": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    ...theme.typography.h4,
  },
  "& h3": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    ...theme.typography.h5,
  },
  "& h4": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    ...theme.typography.h6,
  },
  "& h5": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    ...theme.typography.h6,
  },
  "& h6": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    ...theme.typography.h6,
  },
}));

export function Markdown({ html, ...boxProps }: Props) {
  return <Content {...boxProps} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default memo(Markdown);

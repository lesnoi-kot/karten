import { useMemo, memo } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { micromark } from "micromark";

type Props = {
  md: string;
};

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  "& p": {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

export function Markdown({ md }: Props) {
  const html = useMemo(() => micromark(md), [md]);

  return <Content dangerouslySetInnerHTML={{ __html: html }} />;
}

export default memo(Markdown);

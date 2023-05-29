import { memo, useEffect, useRef } from "react";
import hljs from "highlight.js";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = BoxProps & {
  html: string;
};

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: "100%",
  fontSize: "1rem",
  tabSize: "4",
}));

export function Markdown({ html, ...boxProps }: Props) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.querySelectorAll<HTMLElement>("pre code").forEach((code) => {
      hljs.highlightElement(code);
    });

    ref.current
      .querySelectorAll<HTMLAnchorElement>(
        'a[href^="https://youtu.be/"], a[href^="https://www.youtube.com/"]',
      )
      .forEach((link) => {
        link.classList.add("youtube-link");
      });
  }, [html, ref.current]);

  return (
    <Content
      {...boxProps}
      className="markdown-body"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default memo(Markdown);

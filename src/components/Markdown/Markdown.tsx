import { memo, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import http from "highlight.js/lib/languages/http";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import "./styles.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("html", html);
hljs.registerLanguage("xml", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("php", php);
hljs.registerLanguage("http", http);

type Props = BoxProps & {
  html: string;
};

const Content = styled(Box)<BoxProps>(() => ({
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

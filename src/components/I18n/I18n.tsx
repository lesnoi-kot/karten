import React from "react";

type Props = {
  of: string;
};

function I18n({ of }: Props) {
  return <span>{of}</span>;
}

export default I18n;

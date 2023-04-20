import React from "react";

export function placeCaretToTheEnd(event: React.FocusEvent<HTMLInputElement>) {
  event.target.setSelectionRange(
    event.target.value.length,
    event.target.value.length,
  );
}

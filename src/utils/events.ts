import React from "react";

export function placeCaretToTheEnd(event: React.FocusEvent<HTMLInputElement>) {
  event.target.setSelectionRange(
    event.target.value.length,
    event.target.value.length,
  );
}

export function blurOnEscape(e: React.KeyboardEvent<HTMLInputElement>) {
  if (
    e.key === "Escape" &&
    "blur" in e.target &&
    typeof e.target.blur === "function"
  ) {
    e.target.blur();
    e.stopPropagation();
  }
}

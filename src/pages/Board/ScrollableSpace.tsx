import React from "react";

import usePressAndMoveScroll from "components/hooks/usePressAndMoveScroll";

import styles from "./styles.module.css";

export default function ScrollableSpace({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [scrollableRef, onMouseDown, onMouseUp, onMouseMove] =
    usePressAndMoveScroll<HTMLDivElement>();

  if (disabled) {
    return <div className={styles.dashboard}>{children}</div>;
  }

  return (
    <div
      className={styles.dashboard}
      ref={scrollableRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}

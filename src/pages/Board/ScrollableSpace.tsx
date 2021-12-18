import React from "react";

import usePressAndMoveScroll from "components/hooks/usePressAndMoveScroll";

import styles from "./styles.module.css";

export default function ScrollableSpace({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    scrollableRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  ] = usePressAndMoveScroll<HTMLDivElement>();

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

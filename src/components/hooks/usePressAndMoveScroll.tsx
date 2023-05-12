import { useCallback, useRef, MouseEventHandler, RefObject } from "react";

import styles from "./usePressAndMoveScroll.module.css";

type ReturnType<T> = [
  RefObject<T>,
  MouseEventHandler,
  MouseEventHandler,
  MouseEventHandler,
];

export default function usePressAndMoveScroll<
  T extends HTMLElement,
>(): ReturnType<T> {
  const scrollable = useRef<T>(null);
  const pressed = useRef<boolean>(false);

  const onMouseDown: MouseEventHandler = useCallback((e) => {
    if (!scrollable.current || e.button !== 0) return;

    if ((e.target as HTMLElement).closest('[draggable="true"]') === null) {
      pressed.current = true;
      scrollable.current.classList.add(styles.grabbing);
    }
  }, []);

  const onMouseUp: MouseEventHandler = useCallback((e) => {
    if (!scrollable.current) return;

    pressed.current = false;
    scrollable.current.classList.remove(styles.grabbing);
  }, []);

  const onMouseMove: MouseEventHandler = useCallback(
    (e) => {
      const el = scrollable.current;
      if (!el || !pressed.current) return;
      el.scroll({ left: el.scrollLeft - e.movementX });
    },
    [pressed],
  );

  return [scrollable, onMouseDown, onMouseUp, onMouseMove];
}

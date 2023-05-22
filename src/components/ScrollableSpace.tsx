import { Box, BoxProps } from "@mui/material";
import { useCallback } from "react";

import usePressAndMoveScroll from "components/hooks/usePressAndMoveScroll";

type Props = BoxProps & {
  disabled?: boolean;
};

export const scrollableSpaceId = "scrollable_space";

export function useScrollableSpace() {
  const scrollToLeft = useCallback(() => {
    document
      .getElementById(scrollableSpaceId)
      ?.scroll({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const scrollToRight = useCallback(() => {
    document
      .getElementById(scrollableSpaceId)
      ?.scroll({ top: 0, left: 1e9, behavior: "smooth" });
  }, []);

  return { scrollToLeft, scrollToRight };
}

export default function ScrollableSpace({ disabled, ...props }: Props) {
  const [scrollableRef, onMouseDown, onMouseUp, onMouseMove] =
    usePressAndMoveScroll<HTMLDivElement>();

  if (disabled) {
    return <Box {...props} />;
  }

  return (
    <Box
      ref={scrollableRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      id={scrollableSpaceId}
      {...props}
    />
  );
}

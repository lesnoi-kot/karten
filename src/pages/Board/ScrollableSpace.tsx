import { Box, BoxProps } from "@mui/material";

import usePressAndMoveScroll from "components/hooks/usePressAndMoveScroll";

type Props = BoxProps & {
  disabled?: boolean;
};

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
      id="scrollable_space"
      {...props}
    />
  );
}

import { useState, useCallback } from "react";

export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const on = useCallback(() => {
    setValue(true);
  }, [setValue]);

  const off = useCallback(() => {
    setValue(false);
  }, [setValue]);

  return [value, on, off, setValue] as const;
}

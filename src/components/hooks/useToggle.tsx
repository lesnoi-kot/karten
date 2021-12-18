import { useState, useCallback } from "react";

type ReturnType = [boolean];

export default function useToggle(initialValue: boolean = false): any {
  const [value, setValue] = useState(initialValue);

  const on = useCallback(() => {
    setValue(true);
  }, [setValue]);

  const off = useCallback(() => {
    setValue(false);
  }, [setValue]);

  return [value, on, off, setValue];
}

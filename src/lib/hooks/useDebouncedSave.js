import { useEffect, useRef } from "react";

export function useDebouncedSave(value, delay, saveFn) {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => {
      // console.log(`[useDebouncedSave] Saving after ${delay}ms:`, value);

      saveFn(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value]);
}

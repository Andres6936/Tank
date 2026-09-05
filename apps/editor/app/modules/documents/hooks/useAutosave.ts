import { useEffect, useRef, useState, useCallback } from "react";

const useAutosave = (
  saveFn: () => void | Promise<void>,
  intervalMs: number = 5000,
) => {
  const [isFocused, setIsFocused] = useState(
    () => document.visibilityState === "visible" && document.hasFocus(),
  );

  const isFocusedRef = useRef(isFocused);

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  const updateFocusState = useCallback(() => {
    const visible = document.visibilityState === "visible";
    const focused = document.hasFocus();
    setIsFocused(visible && focused);
  }, []);

  useEffect(() => {
    updateFocusState();

    document.addEventListener("visibilitychange", updateFocusState);
    window.addEventListener("focus", updateFocusState);
    window.addEventListener("blur", updateFocusState);

    return () => {
      document.removeEventListener("visibilitychange", updateFocusState);
      window.removeEventListener("focus", updateFocusState);
      window.removeEventListener("blur", updateFocusState);
    };
  }, [updateFocusState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isFocusedRef.current) {
        void saveFn();
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [saveFn, intervalMs]);

  return { isFocused };
};

export { useAutosave };

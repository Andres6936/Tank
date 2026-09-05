import React, { useEffect } from "react";

const useAutosave = () => {
  const [isFocused, setIsFocused] = React.useState(
    document.visibilityState === "visible",
  );

  useEffect(() => {
    const fn = () => {
      if (document.visibilityState === "visible") {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    document.addEventListener("visibilitychange", fn);

    return () => {
      document.removeEventListener("visibilitychange", fn);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("BBB", isFocused);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isFocused]);
};

export { useAutosave };

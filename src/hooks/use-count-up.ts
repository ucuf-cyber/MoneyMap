"use client";

import * as React from "react";
import { animate } from "framer-motion";

export function useCountUp(value: number, duration = 0.8) {
  const [display, setDisplay] = React.useState(value);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return display;
}

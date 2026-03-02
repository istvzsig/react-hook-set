import { useEffect, useRef } from "react";

/**
 * Custom hook to manage intervals.
 *
 * @param {Function} callback - The function to call on each interval tick.
 * @param {number|null} delay - The interval delay in milliseconds. If null, the interval is cleared.
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

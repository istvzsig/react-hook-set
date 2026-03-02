import { useEffect, useRef } from "react";

/**
 * Custom hook to get the previous value of a state.
 *
 * @param {*} value - The current value.
 * @returns {*} The previous value.
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

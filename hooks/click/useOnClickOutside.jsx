import { useEffect } from "react";

/**
 * Custom hook to detect clicks outside of a specified element.
 *
 * @param {Object} ref - The ref of the element to detect clicks outside of.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    if (!ref || !ref.current || typeof handler !== "function") {
      return;
    }

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

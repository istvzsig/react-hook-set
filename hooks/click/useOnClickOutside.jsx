import { useEffect } from "react";

/**
 * Custom hook to detect clicks outside of a specified element.
 *
 * @param {Object} ref - The ref of the element to detect clicks outside of.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    // Check if ref is valid and handler is a function
    if (!ref || !ref.current || typeof handler !== "function") {
      return;
    }

    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Call the handler
      handler(event);
    };

    // Bind the event listener
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

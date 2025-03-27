import { useEffect } from 'react';

/**
 * Custom hook to detect clicks outside of a specified element.
 * 
 * @param {Object} ref - The ref of the element to detect clicks outside of.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
export function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            // Check if the click is outside the referenced element
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event); // Call the handler if the click is outside
        };

        // Add event listeners for mousedown and touchstart
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Cleanup function to remove the event listeners
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]); // Dependencies
}

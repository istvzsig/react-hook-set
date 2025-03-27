import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage intervals.
 * 
 * @param {Function} callback - The function to call on each interval tick.
 * @param {number|null} delay - The interval delay in milliseconds. If null, the interval is cleared.
 */
export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Store the latest callback in a ref
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current(); // Call the latest callback
        }

        if (delay !== null) {
            const id = setInterval(tick, delay); // Set up the interval
            return () => clearInterval(id); // Cleanup on unmount or delay change
        }
    }, [delay]); // Re-run effect if delay changes
}

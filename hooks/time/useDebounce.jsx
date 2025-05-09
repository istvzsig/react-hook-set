import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * 
 * @param {any} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {any} The debounced value.
 */
export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timeout if value changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

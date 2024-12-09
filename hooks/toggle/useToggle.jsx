import { useCallback, useState } from 'react';

/**
 * Custom hook to toggle a boolean value with improved error handling and performance.
 * 
 * @param {boolean} initialValue - The initial value of the toggle. Defaults to `false`.
 * @returns {[boolean, Function]} An array containing:
 * - value: The current boolean value.
 * - toggle: A function to toggle the value.
 * @throws {TypeError} If `initialValue` is not a boolean.
 */
export function useToggle(initialValue = false) {
    if (typeof initialValue !== 'boolean') {
        throw new TypeError('Initial value must be a boolean.');
    }

    const [value, setValue] = useState(initialValue);

    // Use useCallback to prevent unnecessary re-creation of the toggle function.
    const toggle = useCallback(() => {
        setValue((prevValue) => !prevValue);
    }, []);

    return [value, toggle];
}

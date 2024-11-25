/**
 * Custom hook to manage state with local storage.
 * 
 * @param {string} key - The key for the local storage item.
 * @param {*} initialValue - The initial value to set if the key does not exist.
 * @returns {[*, Function]} An array containing:
 * - storedValue: The current value stored in local storage.
 * - setStoredValue: Function to update the stored value.
 */
export function useLocalStorage(key = "", initialValue = {}) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

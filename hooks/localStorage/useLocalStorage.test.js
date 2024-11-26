import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
    const key = 'testKey';
    const initialValue = { name: 'John Doe' };

    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should initialize with the initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage(key, initialValue));
        expect(result.current[0]).toEqual(initialValue);
    });

    it('should retrieve the value from localStorage if it exists', () => {
        window.localStorage.setItem(key, JSON.stringify({ name: 'Jane Doe' }));
        const { result } = renderHook(() => useLocalStorage(key, initialValue));
        expect(result.current[0]).toEqual({ name: 'Jane Doe' });
    });

    it('should update the value in localStorage when setStoredValue is called', () => {
        const { result } = renderHook(() => useLocalStorage(key, initialValue));
        act(() => {
            result.current[1]({ name: 'Alice' });
        });
        expect(result.current[0]).toEqual({ name: 'Alice' });
        expect(window.localStorage.getItem(key)).toEqual(JSON.stringify({ name: 'Alice' }));
    });

    it('should handle JSON parsing errors gracefully', () => {
        window.localStorage.setItem(key, 'invalid json');
        const { result } = renderHook(() => useLocalStorage(key, initialValue));
        expect(result.current[0]).toEqual(initialValue);
    });

    it('should handle JSON stringifying errors gracefully', () => {
        const { result } = renderHook(() => useLocalStorage(key, initialValue));

        // Mock console.error to suppress error logs during the test
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Simulate an error in JSON.stringify by passing a circular reference
        const circularObject = {};
        circularObject.self = circularObject;

        act(() => {
            result.current[1](circularObject); // This should cause a stringify error
        });

        expect(consoleErrorSpy).toHaveBeenCalled(); // Check if console.error was called
        expect(window.localStorage.getItem(key)).toEqual(JSON.stringify(initialValue)); // Ensure localStorage is unchanged

        consoleErrorSpy.mockRestore();
    });
});

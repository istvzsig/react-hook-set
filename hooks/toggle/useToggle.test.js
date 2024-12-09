import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle Hook', () => {
    it('should initialize with default value (false)', () => {
        const { result } = renderHook(() => useToggle());
        const [value] = result.current;

        expect(value).toBe(false);
    });

    it('should initialize with a custom value', () => {
        const { result } = renderHook(() => useToggle(true));
        const [value] = result.current;

        expect(value).toBe(true);
    });

    it('should toggle the value', () => {
        const { result } = renderHook(() => useToggle());
        const [, toggle] = result.current;

        act(() => toggle()); // toggle to true
        expect(result.current[0]).toBe(true);

        act(() => toggle()); // toggle back to false
        expect(result.current[0]).toBe(false);
    });

    it('should throw error if initialValue is not a boolean', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { }); // Suppress React error logs

        expect(() => {
            renderHook(() => useToggle('not-a-boolean'));
        }).toThrow(TypeError);

        consoleErrorSpy.mockRestore();
    });
});

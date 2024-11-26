import { renderHook, act } from '@testing-library/react';
import useFetch from './useFetch';
import { waitFor } from '@testing-library/react';

global.fetch = jest.fn();

describe('useFetch', () => {

    const jsonPlaceholder = "https://jsonplaceholder.typicode.com/todos/1";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return loading true initially', () => {
        const { result } = renderHook(() => useFetch(jsonPlaceholder));
        act(() => {
            result.current.loading = false;
        });
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should fetch data successfully', async () => {
        const mockData = { message: 'Success' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData),
        });

        const { result } = renderHook(() => useFetch(jsonPlaceholder));
        await waitFor(async () => {
            expect(result.current.loading).toBe(true);
            expect(result.current.data).toEqual(mockData);
            expect(result.current.error).toBeNull();
        });
    });

    it('should handle fetch error', async () => {
        const mockError = new Error('Fetch failed');
        fetch.mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useFetch(jsonPlaceholder));
        await waitFor(async () => {
            await act(async () => {
                // Wait for the fetch to complete
            });
            expect(result.current.loading).toBe(false);
            expect(result.current.data).toBeNull();
            expect(result.current.error).toEqual(mockError);
        });
    });

    it('should handle non-200 responses', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: jest.fn().mockResolvedValueOnce({ message: 'Not Found' }),
        });

        const { result } = renderHook(() => useFetch(jsonPlaceholder));
        await waitFor(async () => {
            await act(async () => {
                // Wait for the fetch to complete
            });
            expect(result.current.loading).toBe(false);
            expect(result.current.data).toBeNull();
            expect(result.current.error).toEqual(new Error("Network response was not ok"));
        });
    });
});

import { renderHook, act, queries } from '@testing-library/react';
import useFilterItems from './useFilterItems';

describe('useFilterItems', () => {
    it('should initialize with empty items and query', () => {
        const { result } = renderHook(() => useFilterItems());

        expect(result.current.items).toEqual([]);
        expect(result.current.query).toBe('');
        expect(result.current.filteredItems).toEqual([]);
    });

    // FIX: This test is fail and need investigation
    it('should update items and filter them based on query', () => {
        const { result } = renderHook(() => useFilterItems());
        const testArray = ['apple', 'banana', 'cherry'];

        // Set initial items
        act(() => {
            result.current.setItems(testArray);
        });

        expect(result.current.items).toEqual(testArray);

        const queryString = 'ban';
        // Set query to filter items
        act(() => {
            result.current.setQuery(queryString);
        });

        // Log filtered items after setting query
        console.log(
            'Filtered items after query set to: ' + queryString,
            result.current.filteredItems
        );

        // Expect filtered items to include 'banana'
        expect(result.current.filteredItems).toEqual(['banana']);
    });


    it('should filter items using a custom filter function', () => {
        const customFilterFunction = (item, query) => item.includes(query);
        const { result } = renderHook(() => useFilterItems(customFilterFunction));

        // Set initial items
        act(() => {
            result.current.setItems(['apple', 'banana', 'apricot']);
        });

        // Set query to filter items
        act(() => {
            result.current.setQuery('ap');
        });

        // Check filtered items using custom filter function
        expect(result.current.filteredItems).toEqual(['apple', 'apricot']);
    });

    it('should return an empty array when no items match the query', () => {
        const { result } = renderHook(() => useFilterItems());

        // Set initial items
        act(() => {
            result.current.setItems(['apple', 'banana', 'cherry']);
        });

        // Set query to a non-matching string
        act(() => {
            result.current.setQuery('orange');
        });

        // Check filtered items
        expect(result.current.filteredItems).toEqual([]);
    });
});

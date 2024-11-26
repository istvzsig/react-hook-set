import { useState, useMemo } from 'react';

/**
 * Custom hook to filter items based on a query string with a custom filter function.
 * 
 * @param {Function} filterFunction - A function to determine how to filter items.
 * @returns {Object} An object containing:
 * - items: The current list of items.
 * - setItems: Function to update the list of items.
 * - query: The current search query.
 * - setQuery: Function to update the search query.
 * - filteredItems: The list of items filtered by the query.
 */
export default function useFilterItems(filterFunction = (item, query) => {
    return item.toString().toLowerCase().includes(query.toLowerCase())
}) {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");

    const filteredItems = useMemo(() => {
        return items.filter(item => filterFunction(item, query));
    }, [items, query, filterFunction]);

    return {
        items,
        setItems,
        query,
        setQuery,
        filteredItems,
    };
}
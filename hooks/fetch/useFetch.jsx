import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch data from a given URL with additional options.
 * 
 * @param {string} url - The URL to fetch data from.
 * @param {Object} options - Optional configuration for the fetch request.
 * @returns {Object} An object containing:
 * - data: The fetched data.
 * - loading: A boolean indicating if the data is still loading.
 * - error: Any error that occurred during the fetch.
 */
export default function useFetch(url = "", options = {}) {
    const { method = 'GET', headers = {}, body = null } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    },
                    body: body ? JSON.stringify(body) : null,
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, method, headers, body]);

    return { data, loading, error };
}
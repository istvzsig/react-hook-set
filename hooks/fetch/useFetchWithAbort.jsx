import { useState, useEffect } from "react";

/**
 * Custom hook to fetch data from a given URL with the ability to abort the request.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Object} An object containing:
 * - data: The fetched data.
 * - loading: A boolean indicating if the data is still loading.
 * - error: Any error that occurred during the fetch.
 */
export function useFetchWithAbort(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal }); // Pass the signal to fetch
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); // Set the fetched data
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error); // Set error if not an abort error
        }
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Abort the fetch request on cleanup
    };
  }, [url]); // Re-run effect if URL changes

  return { data, loading, error }; // Return the data, loading state, and error
}

import { useState, useMemo } from "react";

/**
 * Custom hook to filter items based on a query string.
 * 
 * @returns {Object} An object containing:
 * - items: The current list of items.
 * - setItems: Function to update the list of items.
 * - query: The current search query.
 * - setQuery: Function to update the search query.
 * - filteredItems: The list of items filtered by the query.
 */
export function useFilterItems() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) => {
        return item.toLocaleLowerCase().includes(query.toLocaleLowerCase());
      },
      [items, query]
    );
  });

  return {
    items,
    setItems,
    query,
    setQuery,
    filteredItems,
  };
}

/**
 * Custom hook to manage state with local storage.
 * 
 * @param {string} key - The key for the local storage item.
 * @param {*} initialValue - The initial value to set if the key does not exist.
 * @returns {[*, Function]} An array containing:
 * - storedValue: The current value stored in local storage.
 * - setStoredValue: Function to update the stored value.
 */
export function useLocalStorage(key, initialValue) {
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
export function useFetch(url = "", options = {}) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, headers, body]);

  return { data, loading, error };
}

/**
 * Custom hook to toggle a boolean value.
 * 
 * @param {boolean} initialValue - The initial value of the toggle.
 * @returns {[boolean, Function]} An array containing:
 * - value: The current boolean value.
 * - toggle: Function to toggle the value.
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue((prevValue) => !prevValue);
  };

  return [value, toggle];
}

/**
 * Custom hook to debounce a value.
 * 
 * @param {*} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook to get the previous value of a state.
 * 
 * @param {*} value - The current value.
 * @returns {*} The previous value.
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Custom hook to detect clicks outside of a specified element.
 * 
 * @param {Object} ref - The ref of the element to detect clicks outside of.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

/**
 * Custom hook to manage intervals.
 * 
 * @param {Function} callback - The function to call on each interval tick.
 * @param {number|null} delay - The interval delay in milliseconds. If null, the interval is cleared.
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

import { useState } from "react";
import useFilterItems from "./hooks/useFilterItems";
import useLocalStorage from "./hooks/useLocalStorage";
import useFetch from "./hooks/useFetch";

export {
  useFilterItems,
  useLocalStorage,
  useFetch,
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

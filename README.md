# React Custom Hooks

## Overview

This repository contains a set of custom React hooks designed to simplify common tasks such as filtering items, managing local storage, fetching data from APIs, toggling boolean values, and debouncing input values. These hooks can be easily integrated into any React application.

## Features

- **useFilterItems**: Filter a list of items based on a search query.
- **useLocalStorage**: Manage state that persists in the browser's local storage.
- **useFetch**: Fetch data from a given URL and manage loading and error states.
- **useToggle**: Toggle a boolean state value.
- **useDebounce**: Debounce a value to limit the rate of updates.

## Installation

To use these hooks in your React application, follow these steps:

1. **Clone the File**:

   Download the `hooks.jsx` file from this repository. You can do this by right-clicking on the file and selecting "Save As" or by using the command line:

   ```bash
   curl -O https://raw.githubusercontent.com/istvzsig/hookers/master/hooks.jsx
   ```

2. **Add the Hooks to Your Project**:

   Place the `hooks.jsx` file in your project's `src` directory or any other directory where you keep your hooks.

3. **Import the Hooks**:

   In your component file (e.g., `MyComponent.js`), import the hooks from `hooks.jsx`:

   ```jsx
   import React from "react";
   import { useFilterItems, useLocalStorage, useFetch, useToggle, useDebounce } from "./hooks"; // Adjust the path as necessary

   function MyComponent() {
     const { items, setItems, query, setQuery, filteredItems } = useFilterItems();
     const [storedValue, setStoredValue] = useLocalStorage("myKey", "defaultValue");
     const { data, loading, error } = useFetch("https://api.example.com/data");
     const [isToggled, toggle] = useToggle();
     const debouncedQuery = useDebounce(query, 300);

     // Your component logic here

     return (
       <div>
         <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Search items..."
         />
         <button onClick={toggle}>{isToggled ? "On" : "Off"}</button>
         <ul>
           {loading && <li>Loading...</li>}
           {error && <li>Error: {error.message}</li>}
           {filteredItems.map((item, index) => (
             <li key={index}>{item}</li>
           ))}
         </ul>
       </div>
     );
   }

   export default MyComponent;
   ```

4. **Run Your Application**:

   Start your application using:

   ```bash
   npm start
   ```

   Your application should now display `MyComponent` with the integrated functionality.

## Custom Hooks Implementation

The `hooks.jsx` file contains the following custom hooks:

### useFilterItems

```javascript
import { useState, useMemo } from "react";

export function useFilterItems() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return item.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    });
  }, [items, query]);

  return {
    items,
    setItems,
    query,
    setQuery,
    filteredItems,
  };
}
```

### useLocalStorage

```javascript
import { useState, useEffect } from "react";

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
```

### useFetch

```javascript
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true
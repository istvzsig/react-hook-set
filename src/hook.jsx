import { useState, useMemo } from "react";

export function useFilteredItems() {
  const [items, setItems] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) => {
        return item
          .toLocaleLowerCase()
          .includes(filterQuery.toLocaleLowerCase());
      },
      [items, filterQuery]
    );
  });

  return {
    items,
    setItems,
    filterQuery,
    setFilterQuery,
    filteredItems,
  };
}

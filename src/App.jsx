import React, { useRef } from "react";
import { useFilteredItems } from "./hook";

export default function App() {
  const newItemInputRef = useRef();
  const { filterQuery, setFilterQuery, filteredItems, setItems } =
    useFilteredItems(newItemInputRef);

  function handleSetFilterQuery(event) {
    event.preventDefault();
    setFilterQuery(event.target.value);
  }

  return (
    <>
      {renderSearch(filterQuery, handleSetFilterQuery)}
      {renderForm(newItemInputRef, setItems)}
      {renderFilteredItems(filteredItems)}
    </>
  );
}

function renderSearch(filterQuery, handleSetFilterQuery) {
  return (
    <p className="search">
      <span>Search:</span>
      <input
        value={filterQuery}
        onChange={handleSetFilterQuery}
        type="search"
        name="filter-search"
      />
    </p>
  );
}

function renderForm(newItemInputRef, setItems) {
  function handleAddNewItem(event) {
    const newItemInputRefValue = newItemInputRef.current.value;
    event.preventDefault();
    setItems((prevItems) => {
      return [...prevItems, newItemInputRefValue];
    });
    newItemInputRef.current.value = "";
  }

  return (
    <form onSubmit={handleAddNewItem}>
      <span>New Item:</span>
      <input type="text" ref={newItemInputRef} name="addNew" />
      <button type="submit">Add New</button>
    </form>
  );
}

function renderFilteredItems(items) {
  return (
    <>
      <h3>Items</h3>
      {items.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </>
  );
}

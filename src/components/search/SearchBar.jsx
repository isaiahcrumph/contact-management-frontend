import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Call parent function to filter contacts
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearch}
      placeholder="Search contacts..."
      className="border rounded px-3 py-2 w-full"
    />
  );
};

export default SearchBar;
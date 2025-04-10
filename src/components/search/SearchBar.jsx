import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search contacts..."
        className="bg-gray-700 text-white px-4 py-2 rounded w-full max-w-sm focus:outline-none focus:ring focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search contacts"
      />
    </div>
  );
};

export default SearchBar;

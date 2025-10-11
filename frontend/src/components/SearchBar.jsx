import React from "react";

export default function SearchBar({
  query,
  setQuery,
  region,
  setRegion,
  onSearch,
}) {
  return (
    <div className="search-row">
      <input
        type="text"
        placeholder="Search countries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">All regions</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>

      <button onClick={onSearch}>Search</button>
    </div>
  );
}

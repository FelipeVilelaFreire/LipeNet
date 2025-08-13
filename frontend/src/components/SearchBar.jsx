// Arquivo: src/components/SearchBar.jsx
import { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquise por fotos, pessoas, objetos ou momentos especiais..."
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;
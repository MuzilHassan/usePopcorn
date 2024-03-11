import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

export function Search({ query, setQuery }) {
  const searchRef = useRef();
  useKey("Enter", function () {
    if (document.activeElement === searchRef.current) return;
    searchRef.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={searchRef}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

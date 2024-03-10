import { useEffect, useRef } from "react";

export function Search({ query, setQuery }) {
  const searchRef = useRef();

  useEffect(() => {
    function func(e) {
      if (document.activeElement === searchRef.current) return;
      console.log(e.code);
      if (e.code == "Enter") {
        searchRef.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", func);
    return () => document.removeEventListener("keydown", func);
  }, []);
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

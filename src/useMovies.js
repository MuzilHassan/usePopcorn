import { useEffect, useState } from "react";
import { KEY } from "./App";
export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok)
          throw new Error("Someting went wrong while fecthing movies data");

        const data = await res.json();

        if (data.Response == "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);
  return { error, movies, isLoading };
};

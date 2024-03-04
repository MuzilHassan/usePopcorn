import { useEffect, useState } from "react";
import { WatchedMovieList } from "./WatchedMovieList";
import { Summary } from "./Summary";
import { MovieDetails } from "./MovieDetails";
import { MovieList } from "./MovieList";
import { ListBox } from "./ListBox";
import { Nav } from "./Nav";
import { NumResults } from "./NumResults";
import { Logo } from "./Logo";
import { Search } from "./Search";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    Runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const KEY = "65889ec0";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId((selectedId) => (selectedId == id ? null : id));
  };
  const handleClose = () => {
    setSelectedId(null);
  };
  const addToWatchd = (obj) => {
    if (watched.some((item) => item.imdbID === obj.imdbID)) {
      const Arr = watched.map((item) => {
        if (item.imdbID === obj.imdbID) {
          return item.userRating == obj.userRating
            ? item
            : { ...item, userRating: obj.userRating };
        }
        return item;
      });
      setWatched(Arr);
      return setSelectedId(null);
    }

    setWatched((watched) => [...watched, obj]);
    setSelectedId(null);
  };

  const handleDelete = (id) => {
    setWatched((watched) => watched.filter((item) => item.imdbID !== id));
  };

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

  useEffect(() => {}, []);
  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <ListBox>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MovieList
              movies={movies}
              setSelectedId={handleSelect}
              handleClose={handleClose}
            />
          )}
        </ListBox>
        <ListBox>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              handleClose={handleClose}
              addToWatchd={addToWatchd}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} handleDelete={handleDelete} />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Main({ children }) {
  return <main className="main">{children}</main>;
}

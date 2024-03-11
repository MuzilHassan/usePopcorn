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
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

export const KEY = "65889ec0";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, error, isLoading } = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "watched");
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

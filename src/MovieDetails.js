import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({ id, handleClose, addToWatchd }) {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const handleUserRating = (i) => {
    setUserRating(i + 1);
  };
  useEffect(() => {
    const getDetails = async () => {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`);
      const data = await res.json();
      setDetails(data);
      setIsLoading(false);
    };
    getDetails();
  }, [id]);

  useEffect(() => {
    if (!details.Title) return;
    document.title = `Movie: ${details.Title}`;

    return function () {
      document.title = "Use Popcorn";
    };
  }, [details.Title]);
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={handleClose} className="btn-back">
              &larr;
            </button>
            <img src={details.Poster} alt={`Poster of ${details.Title}`} />

            <div className="details-overview">
              <h2>{details.Title}</h2>
              <p>
                {details.Released} &bull; {details.Runtime}
              </p>
              <p>{details.Genre}</p>
              <p>
                <span>⭐</span>
                {details.imdbRating} imdbRating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                size="20px"
                max={10}
                key={id}
                onSetRating={handleUserRating}
              />
            </div>
            <p>
              <em>{details.Plot}</em>
            </p>
            <p>Staring Actors : {details.Actors}</p>
            <p>Directors : {details.Director}</p>
            {userRating > 0 && (
              <button
                className="btn-add"
                onClick={() =>
                  addToWatchd({ ...details, userRating: userRating })
                }
              >
                Add to WatchList
              </button>
            )}
          </section>
        </>
      )}
    </div>
  );
}

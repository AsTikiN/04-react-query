import type { MouseEvent } from "react";
import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ onSelect, movies }: MovieGridProps) {
  if (movies.length === 0) {
    return null;
  }

  const handleSelect = (event: MouseEvent<HTMLDivElement>, movie: Movie) => {
    event.preventDefault();
    onSelect(movie);
  };

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div
            className={css.card}
            onClick={(event) => handleSelect(event, movie)}
          >
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `${posterBaseUrl}${movie.poster_path}`
                  : "https://placehold.co/500x750?text=No+Poster"
              }
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    retry: 1,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] !== query) {
        return undefined;
      }

      return previousData;
    },
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!data || data.results.length > 0) {
      return;
    }

    toast.error("No movies found for your request.");
  }, [data]);

  const handleSearch = (nextQuery: string) => {
    setSelectedMovie(null);
    setPage(1);
    setQuery(nextQuery);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setSelectedMovie(null);
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main className={css.app}>
        {isLoading && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {!isLoading && !isError && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
        {!isLoading && !isError && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

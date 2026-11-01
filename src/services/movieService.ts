import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}

interface FetchMoviesParams {
  query: string;
  page: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MovieSearchResponse> => {
  const params: FetchMoviesParams = { query, page };

  const response = await axios.get<MovieSearchResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );

  return response.data;
};

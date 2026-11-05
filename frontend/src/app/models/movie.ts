export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number | null;
}
export interface Genre {
  id: number;
  name: string;
}
export interface Page<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
export type View = "popular" | "top-rated" | "favorites";

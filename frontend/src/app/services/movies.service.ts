import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Genre, Movie, Page } from "../models/movie";
@Injectable({ providedIn: "root" })
export class MoviesService {
  private readonly http = inject(HttpClient);
  popular(page: number): Observable<Page<Movie>> {
    return this.http.get<Page<Movie>>("/api/movies/popular", {
      params: { page },
    });
  }
  topRated(page: number): Observable<Page<Movie>> {
    return this.http.get<Page<Movie>>("/api/movies/top-rated", {
      params: { page },
    });
  }

  discover(
    genreId: number,
    page: number,
    sort: "popularity" | "top-rated" = "popularity"
  ): Observable<Page<Movie>> {
    return this.http.get<Page<Movie>>("/api/movies/discover", {
      params: new HttpParams()
        .set("genre", genreId)
        .set("page", page)
        .set("sort", sort),
    });
  }

  search(query: string, page: number): Observable<Page<Movie>> {
    return this.http.get<Page<Movie>>("/api/movies/search", {
      params: new HttpParams().set("query", query).set("page", page),
    });
  }
  details(id: number): Observable<Movie> {
    return this.http.get<Movie>(`/api/movies/${id}`);
  }
  genres(): Observable<{ genres: Genre[] }> {
    return this.http.get<{ genres: Genre[] }>("/api/movies/genres");
  }
}

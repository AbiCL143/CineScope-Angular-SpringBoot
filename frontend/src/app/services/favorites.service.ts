import { Injectable, signal } from "@angular/core";
import { Movie } from "../models/movie";
@Injectable({ providedIn: "root" })
export class FavoritesService {
  private readonly key = "cinescope:favorites:v1";
  readonly movies = signal<Movie[]>(this.load());
  private load(): Movie[] {
    try {
      const data = JSON.parse(localStorage.getItem(this.key) ?? "[]");
      return Array.isArray(data)
        ? data.filter((x) => Number.isInteger(x?.id))
        : [];
    } catch {
      return [];
    }
  }
  has(id: number): boolean {
    return this.movies().some((m) => m.id === id);
  }
  toggle(movie: Movie): void {
    const next = this.has(movie.id)
      ? this.movies().filter((m) => m.id !== movie.id)
      : [...this.movies(), movie];
    this.movies.set(next);
    try {
      localStorage.setItem(this.key, JSON.stringify(next));
    } catch {
      /* Storage can be unavailable */
    }
  }
}

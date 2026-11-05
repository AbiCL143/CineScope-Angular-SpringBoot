import { Component, input, output } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Movie } from "../models/movie";
import { MoviePosterComponent } from "./movie-poster.component";

@Component({
  selector: "app-movie-card",
  standalone: true,
  imports: [DatePipe, DecimalPipe, MoviePosterComponent],
  template: `
    <article class="movie-card">
      <button
        class="poster-button"
        (click)="details.emit(movie())"
        [attr.aria-label]="'Ver detalles de ' + movie().title"
      >
        <app-movie-poster
          [posterPath]="movie().poster_path"
          [title]="movie().title"
        />
      </button>

      <div class="card-info">
        <div class="card-meta">
          <span> ★ {{ movie().vote_average | number : "1.1-1" }} </span>

          <span>
            {{
              movie().release_date
                ? (movie().release_date | date : "yyyy")
                : "Sin fecha"
            }}
          </span>
        </div>

        <h3 [title]="movie().title">
          {{ movie().title }}
        </h3>

        <div class="card-actions">
          <button class="link-button" (click)="details.emit(movie())">
            Ver detalles →
          </button>

          <button
            class="favorite-button"
            (click)="favorite.emit(movie())"
            [attr.aria-label]="
              isFavorite() ? 'Quitar de favoritos' : 'Agregar a favoritos'
            "
            [attr.aria-pressed]="isFavorite()"
          >
            {{ isFavorite() ? "♥" : "♡" }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class MovieCardComponent {
  readonly movie = input.required<Movie>();
  readonly isFavorite = input(false);

  readonly details = output<Movie>();
  readonly favorite = output<Movie>();
}

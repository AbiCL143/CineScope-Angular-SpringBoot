import { Component, input, output } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Movie } from "../models/movie";
@Component({
  selector: "app-movie-card",
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  template: ` <article class="movie-card">
    <button
      class="poster-button"
      (click)="details.emit(movie())"
      [attr.aria-label]="'Ver detalles de ' + movie().title"
    >
      @if(movie().poster_path){<img
        loading="lazy"
        [src]="'https://image.tmdb.org/t/p/w500' + movie().poster_path"
        [alt]="'Póster de ' + movie().title"
        (error)="imageFailed = true"
        [hidden]="imageFailed"
      />} @if(!movie().poster_path || imageFailed){
      <div class="poster-fallback">🎞️<span>Sin póster disponible</span></div>
      }
    </button>
    <div class="card-info">
      <div class="card-meta">
        <span>★ {{ movie().vote_average | number : "1.1-1" }}</span
        ><span>{{
          movie().release_date
            ? (movie().release_date | date : "yyyy")
            : "Sin fecha"
        }}</span>
      </div>
      <h3 [title]="movie().title">{{ movie().title }}</h3>
      <div class="card-actions">
        <button class="link-button" (click)="details.emit(movie())">
          Ver detalles →</button
        ><button
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
  </article>`,
})
export class MovieCardComponent {
  readonly movie = input.required<Movie>();
  readonly isFavorite = input(false);
  readonly details = output<Movie>();
  readonly favorite = output<Movie>();
  imageFailed = false;
}

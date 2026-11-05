import { Component, input, output } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Movie } from "../models/movie";
import { MoviePosterComponent } from "./movie-poster.component";

@Component({
  selector: "app-movie-detail",
  standalone: true,
  imports: [DatePipe, DecimalPipe, MoviePosterComponent],
  template: `
    <div class="modal-overlay" (click)="close.emit()" role="presentation">
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        (click)="$event.stopPropagation()"
      >
        <button
          class="modal-close"
          aria-label="Cerrar detalles"
          (click)="close.emit()"
        >
          ✕
        </button>

        @if (loading()) {
        <div class="state">Cargando detalles…</div>
        } @else if (error()) {
        <div class="state">
          <h2>No se pudieron cargar los detalles</h2>
          <p>{{ error() }}</p>
          <button class="primary-button" (click)="retry.emit()">
            Reintentar
          </button>
        </div>
        } @else { @if (movie(); as m) {
        <div class="detail-layout">
          <div class="detail-poster">
            <app-movie-poster
              [posterPath]="m.poster_path"
              [title]="m.title"
              [lazy]="false"
            />
          </div>

          <div class="detail-copy">
            <p class="eyebrow">FICHA DE PELÍCULA</p>

            <h2 id="detail-title">{{ m.title }}</h2>

            <p class="detail-stats">
              ★ {{ m.vote_average | number : "1.1-1" }} ·
              {{
                m.release_date
                  ? (m.release_date | date : "dd/MM/yyyy")
                  : "Sin fecha"
              }}
              · {{ m.runtime ? m.runtime + " min" : "Duración no disponible" }}
            </p>

            <div class="tags">
              @for (g of m.genres ?? []; track g.id) {
              <span>{{ g.name }}</span>
              }
            </div>

            <h3>Sinopsis</h3>

            <p>
              {{ m.overview || "Sin sinopsis disponible." }}
            </p>

            <button class="primary-button" (click)="favorite.emit(m)">
              {{
                isFavorite() ? "♥ Quitar de favoritos" : "♡ Añadir a favoritos"
              }}
            </button>
          </div>
        </div>
        } }
      </section>
    </div>
  `,
})
export class MovieDetailComponent {
  readonly movie = input<Movie | null>(null);
  readonly loading = input(false);
  readonly error = input("");
  readonly isFavorite = input(false);

  readonly close = output<void>();
  readonly retry = output<void>();
  readonly favorite = output<Movie>();
}

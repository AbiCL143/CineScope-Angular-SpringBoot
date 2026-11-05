import { Component, computed, input, signal } from "@angular/core";

@Component({
  selector: "app-movie-poster",
  standalone: true,
  template: `
    @if (posterPath() && !hasImageError()) {
    <img
      class="movie-poster-image"
      [src]="posterUrl()"
      [alt]="'Póster de ' + title()"
      [attr.loading]="lazy() ? 'lazy' : 'eager'"
      (error)="onImageError()"
    />
    } @else {
    <div
      class="cinematic-poster-fallback"
      role="img"
      [attr.aria-label]="'Póster no disponible de ' + title()"
    >
      <span class="fallback-brand">CINESCOPE</span>

      <div class="fallback-center">
        <svg
          viewBox="0 0 24 24"
          width="54"
          height="54"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 11h16v9H4z" />
          <path d="m4 11-1-5 16-4 2 5-17 4Z" />
          <path d="m7 5 4 5M13 3l4 5" />
          <path d="M8 15h8" />
        </svg>

        <span class="fallback-message"> Una historia por descubrir </span>
      </div>

      <span class="fallback-caption"> PÓSTER NO DISPONIBLE </span>
    </div>
    }
  `,
})
export class MoviePosterComponent {
  readonly posterPath = input<string | null | undefined>(null);
  readonly title = input.required<string>();
  readonly lazy = input(true);

  readonly failedUrl = signal<string | null>(null);

  readonly posterUrl = computed(() =>
    this.posterPath()
      ? `https://image.tmdb.org/t/p/w500${this.posterPath()}`
      : null
  );

  readonly hasImageError = computed(
    () => this.posterUrl() !== null && this.failedUrl() === this.posterUrl()
  );

  onImageError(): void {
    this.failedUrl.set(this.posterUrl());
  }
}

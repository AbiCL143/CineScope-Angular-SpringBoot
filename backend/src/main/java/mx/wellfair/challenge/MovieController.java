package mx.wellfair.challenge;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final TmdbService tmdb;
    private final MovieSearchService movieSearch;

    public MovieController(
            TmdbService tmdb,
            MovieSearchService movieSearch) {

        this.tmdb = tmdb;
        this.movieSearch = movieSearch;
    }

    @GetMapping("/popular")
    public String popular(@RequestParam(defaultValue = "1") int page) {
        validatePage(page);
        return tmdb.fetch("/movie/popular", page, null);
    }

    @GetMapping("/top-rated")
    public String topRated(@RequestParam(defaultValue = "1") int page) {
        validatePage(page);
        return tmdb.fetch("/movie/top_rated", page, null);
    }

    @GetMapping("/search")
    public String search(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "0") int genre) {

        validatePage(page);

        if (query.isBlank() || query.length() > 150) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La búsqueda debe tener entre 1 y 150 caracteres.");
        }

        if (genre < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El género no es válido.");
        }

        String normalizedQuery = query.trim();

        if (genre > 0) {
            return movieSearch.searchByGenre(
                    normalizedQuery,
                    genre,
                    page);
        }

        return tmdb.fetch(
                "/search/movie",
                page,
                normalizedQuery);
    }

    @GetMapping("/discover")
    public String discover(
            @RequestParam int genre,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "popularity") String sort) {

        validatePage(page);

        if (genre <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El género debe ser válido.");
        }

        String sortBy;

        if ("top-rated".equals(sort)) {
            sortBy = "vote_average.desc";
        } else if ("popularity".equals(sort)) {
            sortBy = "popularity.desc";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ordenamiento no válido.");
        }

        return tmdb.discover(page, genre, sortBy);
    }

    @GetMapping("/genres")
    public String genres() {
        return tmdb.fetch("/genre/movie/list", null, null);
    }

    @GetMapping("/{id}")
    public String details(@PathVariable long id) {
        if (id <= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID inválido.");
        return tmdb.fetch("/movie/" + id, null, null);
    }

    private void validatePage(int page) {
        if (page < 1 || page > 500)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La página debe estar entre 1 y 500.");
    }
}

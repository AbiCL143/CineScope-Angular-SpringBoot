
package mx.wellfair.challenge;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Service;

@Service
public class MovieSearchService {

    private static final int PAGE_SIZE = 20;
    private static final int MAX_SEARCH_PAGES = 500;

    private final TmdbService tmdb;
    private final ObjectMapper mapper;

    public MovieSearchService(
            TmdbService tmdb,
            ObjectMapper mapper) {
        this.tmdb = tmdb;
        this.mapper = mapper;
    }

    public String searchByGenre(
            String query,
            int genreId,
            int requestedPage) {

        try {
            ArrayNode matches = mapper.createArrayNode();

            int totalSearchPages = 1;

            for (int page = 1; page <= totalSearchPages; page++) {

                String response = tmdb.fetch(
                        "/search/movie",
                        page,
                        query);

                JsonNode data = mapper.readTree(response);

                if (page == 1) {
                    totalSearchPages = Math.min(
                            data.path("total_pages").asInt(1),
                            MAX_SEARCH_PAGES);
                }

                for (JsonNode movie : data.path("results")) {

                    JsonNode genres = movie.path("genre_ids");

                    if (genres.isArray()) {
                        for (JsonNode genre : genres) {
                            if (genre.asInt() == genreId) {
                                matches.add(movie);
                                break;
                            }
                        }
                    }
                }
            }

            int totalResults = matches.size();

            int totalPages = (int) Math.ceil(
                    (double) totalResults / PAGE_SIZE);

            int start = Math.min(
                    (requestedPage - 1) * PAGE_SIZE,
                    totalResults);

            int end = Math.min(
                    start + PAGE_SIZE,
                    totalResults);

            ArrayNode pageResults = mapper.createArrayNode();

            for (int i = start; i < end; i++) {
                pageResults.add(matches.get(i));
            }

            ObjectNode result = mapper.createObjectNode();

            result.put("page", requestedPage);
            result.put("total_pages", totalPages);
            result.put("total_results", totalResults);
            result.set("results", pageResults);

            return mapper.writeValueAsString(result);

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new ApiException(
                    502,
                    "No fue posible procesar los resultados de TMDB.");
        }
    }
}

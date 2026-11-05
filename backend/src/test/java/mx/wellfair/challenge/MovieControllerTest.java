
package mx.wellfair.challenge;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

class MovieControllerTest {

    private final TmdbService tmdb = mock(TmdbService.class);

    private final MovieSearchService movieSearch = mock(MovieSearchService.class);

    private final MockMvc mvc = MockMvcBuilders
            .standaloneSetup(
                    new MovieController(tmdb, movieSearch))
            .build();

    @Test
    void rejectsInvalidPage() throws Exception {
        mvc.perform(get("/api/movies/popular")
                .param("page", "0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsBlankSearch() throws Exception {
        mvc.perform(get("/api/movies/search")
                .param("query", " "))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsInvalidMovieId() throws Exception {
        mvc.perform(get("/api/movies/0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsInvalidGenre() throws Exception {
        mvc.perform(get("/api/movies/search")
                .param("query", "Batman")
                .param("genre", "-1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchWithoutGenreUsesTmdb() throws Exception {

        when(tmdb.fetch("/search/movie", 1, "Batman"))
                .thenReturn("{\"results\":[]}");

        mvc.perform(get("/api/movies/search")
                .param("query", "Batman")
                .param("page", "1"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"results\":[]}"));

        verify(tmdb).fetch("/search/movie", 1, "Batman");
        verifyNoInteractions(movieSearch);
    }

    @Test
    void searchWithGenreUsesMovieSearchService() throws Exception {

        when(movieSearch.searchByGenre("Batman", 28, 1))
                .thenReturn("{\"results\":[]}");

        mvc.perform(get("/api/movies/search")
                .param("query", "Batman")
                .param("page", "1")
                .param("genre", "28"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"results\":[]}"));

        verify(movieSearch).searchByGenre("Batman", 28, 1);
        verifyNoInteractions(tmdb);
    }
}

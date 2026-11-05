package mx.wellfair.challenge;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.mock;
class MovieControllerTest {
 private final MockMvc mvc=MockMvcBuilders.standaloneSetup(new MovieController(mock(TmdbService.class))).build();
 @Test void rejectsInvalidPage() throws Exception {mvc.perform(get("/api/movies/popular?page=0")).andExpect(status().isBadRequest());}
 @Test void rejectsBlankSearch() throws Exception {mvc.perform(get("/api/movies/search?query=%20")).andExpect(status().isBadRequest());}
 @Test void rejectsInvalidMovieId() throws Exception {mvc.perform(get("/api/movies/0")).andExpect(status().isBadRequest());}
}

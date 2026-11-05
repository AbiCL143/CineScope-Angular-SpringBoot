package mx.wellfair.challenge;
import java.net.URI;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import java.net.http.HttpClient;

@Service
public class TmdbService {
 private final RestClient client;
 private final String token;
 private final String baseUrl;
 public TmdbService(@Value("${tmdb.api.token:}") String token,@Value("${tmdb.api.base-url}") String baseUrl){
  this.token=token;this.baseUrl=baseUrl;
  var factory=new JdkClientHttpRequestFactory(HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(7)).build());factory.setReadTimeout(Duration.ofSeconds(15));
  this.client=RestClient.builder().requestFactory(factory).build();
 }
 public String fetch(String path, Integer page, String query){
  if(token.isBlank())throw new ApiException(503,"Falta configurar TMDB_API_TOKEN en el servidor.");
  var builder=UriComponentsBuilder.fromUriString(baseUrl+path).queryParam("language","es-MX");
  if(page!=null)builder.queryParam("page",page);
  if(query!=null)builder.queryParam("query",query).queryParam("include_adult",false);
  URI uri=builder.build().encode().toUri();
  try{return client.get().uri(uri).header(HttpHeaders.AUTHORIZATION,"Bearer "+token).accept(MediaType.APPLICATION_JSON).retrieve()
   .onStatus(HttpStatusCode::isError,(req,res)->{int status=res.getStatusCode().value();throw new ApiException(status==429?429:502,status==429?"TMDB alcanzó su límite de solicitudes.":"TMDB devolvió un error ("+status+").");})
   .body(String.class);
  }catch(ApiException e){throw e;}catch(RestClientException e){throw new ApiException(502,"No fue posible conectar con TMDB.");}
 }
}

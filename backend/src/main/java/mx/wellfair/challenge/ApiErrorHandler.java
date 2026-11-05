package mx.wellfair.challenge;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class ApiErrorHandler {
 @ExceptionHandler(ApiException.class) public ResponseEntity<Map<String,Object>> handle(ApiException ex){return ResponseEntity.status(ex.getStatus()).body(Map.of("message",ex.getMessage(),"timestamp",Instant.now().toString()));}
}

# CineScope — Prueba técnica Full Stack | Well Fair

Aplicación de consulta de películas con **Angular 19 + TypeScript** y **Java 21 + Spring Boot 3.4**. El navegador consume únicamente nuestra API REST; Spring Boot llama a TMDB con un token almacenado en el servidor.

## Funciones
- Películas populares, búsqueda por título con debounce de 400 ms y detalle con sinopsis, géneros, fecha, duración y calificación.
- Estados de carga, sin resultados, fallos de red, imagen alternativa sin póster y botón de reintento.
- Responsive móvil/tablet/escritorio.
- Extras: paginación, géneros (filtro de resultados de la página actual), mejor calificadas, favoritos en localStorage.

## Requisitos
- Node.js 20.11+ (recomendado 22) y npm.
- Java JDK 21 y Apache Maven 3.9+.
- Cuenta TMDB y **API Read Access Token**: https://www.themoviedb.org/settings/api

## Configuración y ejecución

**1. Backend** (terminal A):

En Linux/macOS:
```bash
cd backend
export TMDB_API_TOKEN='TU_TOKEN_DE_LECTURA'
mvn spring-boot:run
```
En PowerShell (Windows):
```powershell
cd backend
$env:TMDB_API_TOKEN="TU_TOKEN_DE_LECTURA"
mvn spring-boot:run
```
La API queda en `http://localhost:8080`. Comprueba `http://localhost:8080/api/movies/popular`.

**2. Frontend** (terminal B):
```bash
cd frontend
npm install
npm start
```
Abre `http://localhost:4200`. El proxy de Angular redirige `/api` a `http://localhost:8080` durante desarrollo. No se necesita token en Angular.

## Endpoints propios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/movies/popular?page=1` | Películas populares |
| GET | `/api/movies/search?query=matrix&page=1` | Búsqueda |
| GET | `/api/movies/{id}` | Detalle |
| GET | `/api/movies/top-rated?page=1` | Mejor calificadas |
| GET | `/api/movies/genres` | Catálogo de géneros |

## Tests y build
```bash
cd backend && mvn test
cd ../frontend && npm run build
```

## Estructura
- `frontend/src/app/models/`: contratos TypeScript.
- `frontend/src/app/services/`: HTTP y persistencia de favoritos.
- `frontend/src/app/components/`: tarjetas y modal.
- `frontend/src/app/app.component.*`: navegación, búsqueda, filtros y estados.
- `backend/.../MovieController.java`: endpoints y validación.
- `backend/.../TmdbService.java`: integración HTTP con TMDB, timeouts y token.
- `backend/.../ApiErrorHandler.java`: errores controlados.

## Seguridad y decisiones técnicas
- El token se configura como variable de entorno **solo en backend**. Nunca se incluye en Git ni en el bundle Angular.
- Spring Boot valida rangos de página, IDs y longitud de búsqueda; las solicitudes externas tienen timeouts.
- No se necesita base de datos: favoritos se guardan localmente en el navegador.
- El filtro por género es **local a los resultados cargados** y no una búsqueda global por género. Para un filtro global sería necesario `/discover/movie`.
- En producción hay que servir Angular y API bajo el mismo dominio o configurar un reverse proxy y CORS de origen específico.
- Las imágenes son propiedad de sus titulares. Datos de TMDB. Este producto utiliza la API de TMDB, pero TMDB no lo avala ni certifica.

## Checklist previo a entrega
1. Probar con token real las rutas de populares, búsqueda, detalle y géneros.
2. Comprobar resultados vacíos, desconexión de backend y póster ausente.
3. Revisar vista móvil (375 px), tablet (768 px) y escritorio.
4. Ejecutar tests y build; revisar que no hay secretos en Git.
5. Subir el repositorio a GitHub con commits propios; adjuntar capturas reales.

## Commits sugeridos (realizarlos mientras trabajas)
`chore: initialize Angular and Spring Boot` → `feat(api): proxy TMDB endpoints` → `feat(ui): movie catalog and search` → `feat: details and favorites` → `docs: add setup and tests`.

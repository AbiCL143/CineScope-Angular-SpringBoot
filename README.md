# 🎬 CineScope

Aplicación web Full Stack para explorar películas utilizando la API de TMDB, desarrollada como prueba técnica para **Well Fair**.

El proyecto implementa una arquitectura cliente-servidor con **Angular 19 y TypeScript** en el frontend y **Java 21 con Spring Boot 3.4** en el backend.

## Tecnologías

**Frontend**
- Angular 19
- TypeScript
- HTML y CSS

**Backend**
- Java 21
- Spring Boot 3.4
- API REST
- Maven

**Integración**
- The Movie Database (TMDB API)
- LocalStorage para favoritos

## Funcionalidades

- Consulta de películas populares y mejor calificadas.
- Búsqueda de películas por título.
- Filtrado por género y búsqueda combinada.
- Paginación de resultados.
- Visualización de detalles: sinopsis, géneros, fecha de estreno, duración y calificación.
- Gestión de películas favoritas mediante LocalStorage.
- Diseño responsive para dispositivos móviles, tabletas y computadoras.
- Póster alternativo personalizado cuando una película no tiene imagen.
- Manejo de estados de carga, errores y resultados vacíos.

## Instalación y ejecución

### Requisitos

- Node.js 20.11 o superior
- Java JDK 21
- Maven 3.9 o superior
- Token de acceso a la API de [TMDB](https://www.themoviedb.org/settings/api)

### 1. Backend

Desde PowerShell:

```powershell
cd backend
$env:TMDB_API_TOKEN="TU_TOKEN_DE_TMDB"
mvn spring-boot:run
```

El servidor estará disponible en:

`http://localhost:8080`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Abrir en el navegador:

`http://localhost:4200`

Angular utiliza un proxy para comunicarse con el backend, por lo que el token de TMDB permanece exclusivamente en el servidor.

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/movies/popular` | Películas populares |
| GET | `/api/movies/top-rated` | Películas mejor calificadas |
| GET | `/api/movies/search` | Búsqueda por título y género |
| GET | `/api/movies/discover` | Exploración por género |
| GET | `/api/movies/genres` | Géneros disponibles |
| GET | `/api/movies/{id}` | Detalles de una película |

## Pruebas

**Backend**

```bash
cd backend
mvn test
```

**Frontend**

```bash
cd frontend
npm run build
```

## Arquitectura

```text
CineScope
├── frontend/
│   └── Angular + TypeScript
│       ├── Components
│       ├── Services
│       └── Models
│
└── backend/
    └── Spring Boot + Java
        ├── Controllers
        └── Services
              │
              ▼
           TMDB API
```

El frontend consume exclusivamente los endpoints del backend, que se encarga de comunicarse con TMDB y proteger las credenciales de acceso.

## Créditos

Este producto utiliza la API de TMDB, pero no está avalado ni certificado por TMDB.

Desarrollado como prueba técnica Full Stack para **Well Fair**.
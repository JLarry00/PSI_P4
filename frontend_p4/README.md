# PSI Práctica 4 — SongProject Frontend

## Autores

- Alejandro Morillas Parra
- Juan Larrondo Fernández de Córdoba

Aplicación web para el aprendizaje de idiomas mediante canciones.
Frontend implementado con Vue 3 + Vite, Vue Router y Pinia. Se comunica con el backend de Django REST Framework desplegado en render.com y utiliza Cypress para los tests E2E y de componentes.

> **Importante sobre render.com**: el backend desplegado en render.com pertenece al repositorio original de la práctica 3, no a este repositorio conjunto de entrega. Por tanto, los `push` realizados en este repositorio solo actualizarán el despliegue del frontend. Para actualizar el backend desplegado habría que hacer `push` en el repositorio original del backend.

---

## Despliegue en producción

| | |
|---|---|
| **URL frontend** | https://four-songproject-99-2311-2026-v1.onrender.com |
| **URL backend** | https://three-songproject-99-2311-2026-v1.onrender.com |
| **API REST** | https://three-songproject-99-2311-2026-v1.onrender.com/api/v1/ |
| **Panel admin** | https://three-songproject-99-2311-2026-v1.onrender.com/admin/ |
| **Base de datos** | neon.tech (ver `.env` en la raíz del proyecto) |


---

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `alumnodb` | `alumnodb` | Superusuario / administrador |
| `user1` | `user1password` | Usuario de prueba |
| `user2` | `user2password` | Usuario de prueba |

---

## Funcionalidades principales

- Página de inicio con las canciones más populares, buscador por título y canción aleatoria.
- Autenticación mediante token usando los endpoints de Djoser del backend.
- Reproducción de canciones con audio, imagen de portada y letra sincronizada en formato LRC.
- Ejercicio interactivo de completar palabras omitidas durante la reproducción.
- Registro de resultados del usuario autenticado mediante el endpoint `songusers/`.
- Página de FAQ y navegación principal mediante Vue Router.

---

## Rutas del frontend

| Ruta | Vista | Descripción |
|------|------|-------------|
| `/` | `HomeView` | Inicio, top canciones, búsqueda y canción aleatoria |
| `/log-in` | `LoginView` | Inicio de sesión |
| `/log-out` | `LogoutView` | Cierre de sesión y limpieza de token |
| `/songs/:id` | `PlayView` | Reproducción de canción y ejercicio de letras |
| `/faq` | `FaqView` | Preguntas frecuentes |

---

## Configuración de entornos

El frontend usa ficheros de entorno específicos de Vite:

| Fichero | Uso |
|---------|-----|
| `.env.development` | Variables usadas al ejecutar `npm run dev` |
| `.env.production` | Variables usadas al ejecutar `npm run build` en producción |

Variables principales:

| Variable | Descripción |
|----------|-------------|
| `FRONTEND_URL` | URL pública del frontend desplegado |
| `VITE_BACKEND_URL` | URL base del backend usado por el proxy de Vite |
| `VITE_BACKEND_URL_LOCAL` | URL del backend local, normalmente `http://localhost:8000` |
| `DATABASE_URL` | URI de Neon requerida para la entrega |

En desarrollo, Vite usa un proxy configurado en `vite.config.js` para redirigir `/api` y `/media` al backend. En producción, el frontend genera las URLs del backend mediante `src/utils/backendUrl.js`.

> Solo las variables que empiezan por `VITE_` quedan disponibles en el código del navegador. `DATABASE_URL` se mantiene por requisito de entrega, pero no debe usarse desde código cliente.

---

## Estructura del proyecto

```
frontend_p4/
├── .env.development        ← variables de entorno para desarrollo
├── .env.production         ← variables de entorno para producción
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js          ← configuración de Vite y proxy al backend
├── cypress.config.js       ← configuración de Cypress
├── public/
├── cypress/
│   ├── e2e/                ← tests end-to-end
│   └── support/            ← comandos y configuración auxiliar de Cypress
└── src/
    ├── App.vue             ← layout principal y navegación
    ├── main.js             ← entrada de la aplicación Vue
    ├── router/             ← rutas de Vue Router
    ├── stores/             ← stores de Pinia
    ├── utils/              ← helpers comunes, como backendUrl
    ├── views/              ← vistas principales
    ├── components/         ← componentes reutilizables
    └── assets/             ← estilos y recursos estáticos
```

---

## Configuración local

### Requisitos previos

- Node.js 20.x
- npm
- Backend disponible en render.com o en local en `http://localhost:8000`

### Instalación

```bash
cd frontend_p4
npm install
```

### Arrancar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible normalmente en `http://localhost:5173/`.

Si se quiere usar el backend local, arrancar primero Django en el puerto 8000 y ajustar `VITE_BACKEND_URL` en `.env.development`.

### Build de producción

```bash
npm run build
```

El resultado se genera en `frontend_p4/dist/`.

### Probar el build localmente

```bash
npm run preview
```

Por defecto, Vite sirve el build en `http://localhost:4173/`.

---

## Tests

Los comandos se ejecutan desde `frontend_p4/`.

### Test E2E contra el despliegue

```bash
npm run test:e2e
```

Ejecuta Cypress en modo headless. Actualmente `cypress.config.js` usa como `baseUrl` el despliegue de render.com.

### Test E2E en modo interactivo

```bash
npm run test:e2e:dev
```

Arranca Vite en el puerto 4173 y abre Cypress en modo interactivo. La URL objetivo de los tests se configura en `cypress.config.js`.

### Tests de componentes

```bash
npm run test:unit
```

### Tests de componentes en modo interactivo

```bash
npm run test:unit:dev
```

---

## Comandos útiles de npm

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run render-build` | Instala dependencias y genera el build para render.com |
| `npm run preview` | Sirve localmente el build generado |
| `npm run start` | Arranca el preview escuchando en `0.0.0.0` para render.com |
| `npm run test:e2e` | Ejecuta Cypress E2E en modo headless |
| `npm run test:e2e:dev` | Abre Cypress E2E en modo interactivo |
| `npm run test:unit` | Ejecuta Cypress Component Testing |
| `npm run test:unit:dev` | Abre Cypress Component Testing |
| `npm run lint` | Ejecuta ESLint con autofix |

---

## Relación con el backend

El frontend consume la API REST documentada en `backend-p3/README.md`.

Endpoints principales usados por la aplicación:

| Endpoint | Uso |
|----------|-----|
| `POST /api/v1/token/login/` | Inicio de sesión |
| `GET /api/v1/users/me/` | Recuperar usuario autenticado |
| `GET /api/v1/songs/top/` | Mostrar canciones populares |
| `GET /api/v1/songs/search/?title=<texto>` | Buscar canciones por título |
| `GET /api/v1/songs/random/` | Obtener canción aleatoria |
| `GET /api/v1/songs/<id>/` | Cargar detalle de canción |
| `POST /api/v1/songusers/` | Guardar resultado del usuario |

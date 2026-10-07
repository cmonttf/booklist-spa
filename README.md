# BookList SPA

## Descripción

BookList es una aplicación de página única (SPA) construida con Vue.js que permite
gestionar el catálogo de libros de **Editorial Nova**: agregar libros mediante un
formulario reactivo, visualizarlos en un listado, filtrarlos por autor o categoría,
eliminarlos, consultar el detalle individual de cada uno a través de una ruta
dinámica, y monitorear el catálogo mediante un dashboard de indicadores en tiempo
real.

El proyecto fue desarrollado como trabajo académico para demostrar el uso de
componentes, reactividad, directivas, formularios con `v-model`, manejo de eventos
y Vue Router, siguiendo el patrón **MVVM**.

## Funcionalidades

- Pantalla de inicio con dashboard de indicadores de gestión (total de libros, por
  categoría, por tipo y promedio por categoría), calculados en tiempo real.
- Listado de libros con tarjetas reutilizables.
- Agregar libros mediante formulario con selects dependientes (categoría → tipo) y
  vista previa en tiempo real.
- Validación de campos obligatorios (título, autor, categoría, tipo).
- Filtrar libros por autor y por categoría.
- Eliminar libros con confirmación.
- Ver el detalle individual de cada libro mediante rutas dinámicas (`/libros/:id`).
- Navegación 100% SPA con Vue Router (sin recargas de página).
- Manejo correcto de identificadores de libro inexistentes.

## Tecnologías

- Vue.js 3
- Vue Router 4
- JavaScript (ES2015+)
- CSS puro
- Webpack 5 (configuración manual, sin Vue CLI)

**Este proyecto no utiliza Vite.** La compilación se realiza con Webpack y la
compatibilidad de navegadores se define mediante el archivo `.browserslistrc` en la
raíz del proyecto, leído tanto por Babel (`babel.config.js` con
`@babel/preset-env`) como por cualquier otra herramienta que lo requiera.

## Instalación

```bash
npm install
```

## Ejecución

Modo desarrollo (con recarga en caliente):

```bash
npm run serve
```

La aplicación queda disponible en `http://localhost:8080`.

Compilación de producción:

```bash
npm run build
```

Los archivos generados se ubican en la carpeta `dist/` (no requiere servidor
especial: `index.html` + `js/main.js` + `css/main.css`).

## Estructura del proyecto

```text
booklist-spa/
├── public/
│   └── index.html                # Plantilla HTML base (un solo <div id="app">)
├── src/
│   ├── assets/
│   │   └── estilos.css           # Estilos globales (un solo sistema de diseño)
│   ├── components/
│   │   ├── Libro.vue             # Tarjeta reutilizable de un libro
│   │   ├── LibroFormulario.vue   # Formulario para agregar libros
│   │   └── LibroFiltro.vue       # Filtro por autor y categoría
│   ├── router/
│   │   └── index.js              # Definición de rutas (Vue Router)
│   ├── store/
│   │   └── libros.js             # Estado reactivo centralizado (Model)
│   ├── views/
│   │   ├── InicioView.vue        # "/" — dashboard de indicadores
│   │   ├── ListaLibros.vue       # "/libros" — gestión del catálogo
│   │   └── DetalleLibro.vue      # "/libros/:id" — detalle de un libro
│   ├── App.vue                   # Layout raíz: navegación + <router-view>
│   └── main.js                   # Punto de entrada, monta la app y el router
├── .browserslistrc
├── babel.config.js
├── webpack.config.js
├── package.json
└── README.md
```

## Cómo se construyó — componentes y arquitectura

El proyecto sigue el patrón **MVVM**, apoyado en una arquitectura modular (en vez
de un único archivo monolítico) para mantener responsabilidades separadas:

- **Model** — el estado reactivo vive en un solo lugar: [src/store/libros.js](./src/store/libros.js).
  Ahí se define el arreglo `libros` (envuelto en `reactive()` de Vue) y las
  funciones que lo modifican: `obtenerLibros()`, `obtenerLibroPorId(id)`,
  `agregarLibro(datos)` y `eliminarLibro(id)`. También exporta las constantes
  `CATEGORIAS` (`Ficción`, `No Ficción`, `Técnico`) y `TIPOS_POR_CATEGORIA` (el
  subtipo específico dentro de cada categoría, p. ej. `Novela`, `Ensayo`,
  `Manual`). Cada libro tiene: `id`, `titulo`, `autor`, `categoria`, `tipo`,
  `descripcion` y `fechaPublicacion`.

  En vez de Vuex o Pinia se usa un **módulo reactivo simple**: como
  `obtenerLibros()` devuelve siempre la misma referencia reactiva, todas las
  vistas que la importan quedan sincronizadas automáticamente entre sí — el
  estado se mantiene consistente al navegar entre `/`, `/libros` y
  `/libros/:id`, sin necesidad de una librería externa de estado.

- **View** — el `<template>` de cada componente `.vue`.

- **ViewModel** — los `methods` y `computed` de cada componente (por ejemplo
  `librosFiltrados` en `ListaLibros.vue`, o los indicadores del dashboard en
  `InicioView.vue`), que conectan el modelo con la vista sin lógica compleja
  embebida en el template.

### Componentes reutilizables (`src/components/`)

| Componente | Props que recibe | Eventos que emite | Responsabilidad |
|---|---|---|---|
| `Libro.vue` | `libro` (objeto), `mostrarBotonEliminar` (bool) | `eliminar` (id del libro) | Muestra una tarjeta con título, autor, categoría · tipo, año y descripción; pide confirmación antes de eliminar. |
| `LibroFormulario.vue` | — | `agregar-libro` (datos del nuevo libro) | Formulario completo: título, autor, categoría, tipo (dependiente de la categoría), año opcional y descripción opcional. Valida y muestra vista previa en vivo. |
| `LibroFiltro.vue` | `filtros` (objeto `{ autor, categoria }`) | `actualizar:filtros` (nuevo objeto de filtros) | Campos de filtro por autor y categoría. Nunca modifica la prop directamente: emite el nuevo valor y el padre decide qué hacer con él. |

Los componentes hijos **nunca mutan sus props**; toda comunicación hacia el
padre se hace con eventos personalizados (`$emit`), y el padre es quien decide
cómo actualizar el estado (llamando a las funciones del store).

### Vistas (`src/views/`) y rutas

[src/router/index.js](./src/router/index.js) define las tres rutas requeridas:

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | `InicioView.vue` | Bienvenida + dashboard de indicadores de gestión. |
| `/libros` | `ListaLibros.vue` | Formulario para agregar, filtro, listado y eliminación. |
| `/libros/:id` | `DetalleLibro.vue` | Detalle de un libro puntual, con `props: true` para recibir el `id` como prop en vez de leerlo manualmente desde `$route`. |

`DetalleLibro.vue` busca el libro correspondiente en el store y, si no existe,
muestra un mensaje claro junto con un enlace para volver al listado. Toda la
navegación usa `<router-link>`, manteniendo el comportamiento SPA (sin recargas
de página).

### `App.vue` — layout raíz

Contiene el encabezado, la navegación principal (`<router-link>` a Inicio y
Libros) y el `<router-view />` donde se renderiza cada vista. También incluye
un botón "Ayuda inicial" con el modificador `@click.once`, que muestra un
mensaje de bienvenida únicamente la primera vez que se presiona.

## Conceptos de Vue.js demostrados (por lección)

### Lección 1 — Introducción a Vue.js: contador y dashboard de indicadores

[InicioView.vue](./src/views/InicioView.vue) muestra el nombre de usuario
(`usuario.nombre`) mediante interpolación, un **contador reactivo** básico
(`contador` en `data()`, con los métodos `incrementar`, `disminuir` y
`reiniciar`) y, además, un dashboard con 4 indicadores de gestión para
Editorial Nova, calculados con propiedades `computed` a partir del catálogo
real de libros:

- `totalLibros` — cantidad total de libros.
- `librosPorCategoria` — cantidad agrupada por `Ficción` / `No Ficción` / `Técnico`.
- `librosPorTipo` — cantidad agrupada por subtipo (`Novela`, `Ensayo`, `Manual`, etc.).
- `promedioLibrosPorCategoria` — total de libros dividido por la cantidad de categorías.

Al agregar o eliminar un libro desde `/libros`, estos indicadores se recalculan
solos porque `InicioView` lee el mismo arreglo reactivo del store
(`obtenerLibros()`) que usa `ListaLibros`.

### Lección 2 — Templates y rendering

- `Libro.vue` es el componente reutilizable que recibe un libro completo
  mediante `props` y muestra título, autor, categoría, tipo y descripción.
- **v-bind:** se usa en su forma explícita (no la abreviada `:`) para clases
  dinámicas y atributos de datos en `Libro.vue`, y para el `value` de los
  campos de `LibroFiltro.vue`.
- **v-for:** el listado se recorre con `v-for="libro in librosFiltrados"`
  usando `libro.id` como `key`.
- **v-if / v-else:** controla la descripción del libro cuando falta, el estado
  encontrado/no encontrado en `DetalleLibro.vue`, y el mensaje "No hay libros
  disponibles." cuando el listado filtrado queda vacío.
- **v-show:** se usa en el panel de vista previa del formulario, en el mensaje
  de bienvenida de `App.vue` (mostrado con `.once`) y en el botón "Limpiar
  filtros".

### Lección 3 — Formulario reactivo

`LibroFormulario.vue` contiene input de título, input de autor, select de
categoría, select de tipo (dependiente de la categoría elegida, según
`TIPOS_POR_CATEGORIA`), input opcional de año de publicación y textarea de
descripción, todos conectados con `v-model` a un objeto `nuevoLibro` reactivo.
La vista previa se actualiza automáticamente mientras el usuario escribe,
mostrando valores alternativos ("Sin título", "Autor no especificado", etc.)
cuando un campo está vacío. La validación impide agregar un libro si falta
título, autor, categoría o tipo, mostrando mensajes claros por campo.

### Lección 4 — Manejo de eventos

- `@click` en múltiples botones: "Agregar libro" (`type="button"`, para que
  el click dispare `manejarEnvio` una sola vez sin pasar por el envío nativo
  del formulario), eliminar, alternar vista previa, limpiar filtros, y el
  contador de `InicioView.vue`.
- `@submit.prevent` en el `<form>` sigue evitando la recarga de página si el
  usuario presiona Enter en un campo que no tiene su propio manejador de
  teclado (categoría, tipo, año, descripción).
- `@keydown.enter.prevent` junto con `@keyup.enter` en los campos de título y
  autor permite agregar un libro presionando Enter, sin que el navegador
  dispare además el envío nativo del formulario (lo que provocaría una
  duplicación accidental del libro).
- `.once` se usa en el botón "Ayuda inicial" de `App.vue`: solo la primera vez
  que se presiona se muestra el mensaje de bienvenida.
- La eliminación se dispara con `@click`, pide confirmación (`window.confirm`)
  y actualiza el arreglo reactivo mediante `splice`.

### Lección 5 — Vue Router

Ver tabla de rutas más arriba. Rutas dinámicas con `props: true`, navegación
100% con `<router-link>`, manejo explícito de IDs inexistentes en
`DetalleLibro.vue`.

## Decisiones técnicas

- **Arquitectura modular:** cada responsabilidad vive en su propio archivo
  (componentes de presentación en `components/`, pantallas en `views/`, estado
  en `store/`, configuración de rutas en `router/`), lo que facilita reutilizar
  `Libro.vue`, `LibroFormulario.vue` y `LibroFiltro.vue` desde distintas vistas
  si el proyecto creciera.
- **Gestión del estado:** un módulo con `reactive()` de Vue
  ([src/store/libros.js](./src/store/libros.js)) en lugar de Vuex/Pinia. Al ser
  un único objeto reactivo importado por las vistas que lo necesitan, el
  estado se mantiene consistente al navegar entre `/libros` y `/libros/:id`.
- **Comunicación entre componentes:** los hijos reciben datos únicamente
  mediante `props` y nunca los modifican directamente; para comunicar acciones
  hacia el padre usan eventos personalizados (`$emit`), por ejemplo `eliminar`
  en `Libro.vue` o `agregar-libro` en `LibroFormulario.vue`.
- **Por qué no se utilizó Vite:** el proyecto exige explícitamente una
  configuración basada en Webpack/Vue CLI. Se optó por una configuración
  manual de Webpack 5 (`webpack.config.js`) con `vue-loader` y `babel-loader`
  en lugar de `vue create`, para tener control total sobre el pipeline de
  build sin depender del ecosistema Vite en ningún punto (no se usa
  `vite.config.js` ni `import.meta.env`).
- **Uso de `.browserslistrc`:** define el rango de navegadores objetivo
  (`> 0.5%`, `last 2 versions`, `not dead`, `not IE 11`). `babel.config.js`
  usa `@babel/preset-env`, que lee automáticamente este archivo para decidir
  qué transformaciones de sintaxis aplicar, evitando duplicar esa
  configuración en `package.json` o en herramientas específicas de Vite.

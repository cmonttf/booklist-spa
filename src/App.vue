<template>
  <header class="encabezado">
    <div class="contenedor">
      <h1 class="encabezado__marca">📚 BookList</h1>
      <nav class="navegacion">
        <router-link to="/">Inicio</router-link>
        <router-link to="/libros">Libros</router-link>
        <button class="boton boton--acento" @click.once="mostrarBienvenida">
          Ayuda inicial
        </button>
      </nav>
    </div>
  </header>

  <!-- v-show: se oculta sin desmontar el bloque, útil para un aviso puntual -->
  <div v-show="bienvenidaVisible" class="contenedor">
    <div class="tarjeta" style="margin-top: 1rem; border-left: 4px solid var(--color-acento);">
      <strong>¡Bienvenido/a a BookList!</strong>
      <p style="margin: 0.4rem 0 0;">
        Este mensaje de ayuda solo se muestra la primera vez que presionas el botón
        "Ayuda inicial" (evento con modificador <code>.once</code>). Usa la navegación
        superior para moverte entre el inicio y el listado de libros.
      </p>
    </div>
  </div>

  <main class="contenido-principal">
    <router-view />
  </main>

  <footer class="pie-pagina">
    BookList SPA &mdash; Proyecto académico construido con Vue.js y Webpack.
  </footer>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      bienvenidaVisible: false
    }
  },
  methods: {
    mostrarBienvenida() {
      this.bienvenidaVisible = true
    }
  }
}
</script>

<style>
/* Los estilos globales se importan desde src/assets/estilos.css en main.js */
</style>

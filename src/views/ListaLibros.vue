<template>
  <div class="contenedor">
    <section class="seccion">
      <h2 class="seccion__titulo">Agregar un nuevo libro</h2>
      <LibroFormulario @agregar-libro="manejarAgregarLibro" />
    </section>

    <section class="seccion">
      <h2 class="seccion__titulo">Catálogo de libros</h2>
      <LibroFiltro :filtros="filtros" @actualizar:filtros="filtros = $event" />

      <div v-if="librosFiltrados.length" class="rejilla-libros">
        <Libro
          v-for="libro in librosFiltrados"
          :key="libro.id"
          :libro="libro"
          @eliminar="manejarEliminarLibro"
        />
      </div>
      <p v-else class="mensaje-vacio">No hay libros disponibles.</p>
    </section>
  </div>
</template>

<script>
import Libro from '@/components/Libro.vue'
import LibroFormulario from '@/components/LibroFormulario.vue'
import LibroFiltro from '@/components/LibroFiltro.vue'
import { obtenerLibros, agregarLibro, eliminarLibro } from '@/store/libros'

export default {
  name: 'ListaLibros',
  components: { Libro, LibroFormulario, LibroFiltro },
  data() {
    return {
      libros: obtenerLibros(),
      filtros: {
        autor: '',
        categoria: ''
      }
    }
  },
  computed: {
    librosFiltrados() {
      const autorBuscado = this.filtros.autor.trim().toLowerCase()
      return this.libros.filter(libro => {
        const coincideAutor = !autorBuscado || libro.autor.toLowerCase().includes(autorBuscado)
        const coincideCategoria = !this.filtros.categoria || libro.categoria === this.filtros.categoria
        return coincideAutor && coincideCategoria
      })
    }
  },
  methods: {
    manejarAgregarLibro(datosLibro) {
      agregarLibro(datosLibro)
    },
    manejarEliminarLibro(idLibro) {
      eliminarLibro(idLibro)
    }
  }
}
</script>

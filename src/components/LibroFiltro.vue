<template>
  <div class="filtro tarjeta">
    <div class="campo">
      <label for="filtro-autor">Filtrar por autor</label>
      <input
        id="filtro-autor"
        type="text"
        placeholder="Escribe un autor..."
        v-bind:value="filtros.autor"
        @input="actualizarAutor"
      />
    </div>

    <div class="campo">
      <label for="filtro-categoria">Filtrar por categoría</label>
      <select id="filtro-categoria" v-bind:value="filtros.categoria" @change="actualizarCategoria">
        <option value="">Todas las categorías</option>
        <option v-for="categoria in categorias" :key="categoria" :value="categoria">
          {{ categoria }}
        </option>
      </select>
    </div>

    <button
      v-show="filtros.autor || filtros.categoria"
      type="button"
      class="boton boton--secundario"
      @click="limpiarFiltros"
    >
      Limpiar filtros
    </button>
  </div>
</template>

<script>
import { CATEGORIAS } from '@/store/libros'

export default {
  name: 'LibroFiltro',
  props: {
    filtros: {
      type: Object,
      required: true
    }
  },
  emits: ['actualizar:filtros'],
  data() {
    return {
      categorias: CATEGORIAS
    }
  },
  methods: {
    // v-bind explícito arriba (no la forma abreviada ":value") para demostrar
    // el requerimiento académico de uso de v-bind; se combina con un evento
    // personalizado en lugar de v-model porque el objeto es una prop del padre.
    actualizarAutor(evento) {
      this.$emit('actualizar:filtros', { ...this.filtros, autor: evento.target.value })
    },
    actualizarCategoria(evento) {
      this.$emit('actualizar:filtros', { ...this.filtros, categoria: evento.target.value })
    },
    limpiarFiltros() {
      this.$emit('actualizar:filtros', { autor: '', categoria: '' })
    }
  }
}
</script>

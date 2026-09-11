<template>
  <article
    class="tarjeta tarjeta-libro"
    v-bind:class="{ 'tarjeta-libro--destacada': libro.categoria === 'Técnico' }"
    v-bind:data-libro-id="libro.id"
  >
    <span class="tarjeta-libro__categoria">{{ libro.categoria }} · {{ libro.tipo }}</span>
    <h3>{{ libro.titulo }}</h3>
    <p><strong>Autor:</strong> {{ libro.autor }}</p>
    <p v-if="libro.fechaPublicacion"><strong>Año:</strong> {{ libro.fechaPublicacion }}</p>
    <p v-if="libro.descripcion">{{ descripcionResumida }}</p>
    <p v-else class="mensaje-vacio">Sin descripción disponible.</p>

    <div class="tarjeta-libro__acciones">
      <router-link
        class="boton boton--secundario"
        v-bind:to="{ name: 'detalle-libro', params: { id: libro.id } }"
      >
        Ver detalle
      </router-link>
      <button
        v-if="mostrarBotonEliminar"
        class="boton boton--peligro"
        @click="confirmarEliminacion"
      >
        Eliminar
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'Libro',
  props: {
    libro: {
      type: Object,
      required: true
    },
    mostrarBotonEliminar: {
      type: Boolean,
      default: true
    }
  },
  emits: ['eliminar'],
  computed: {
    descripcionResumida() {
      const limite = 120
      return this.libro.descripcion.length > limite
        ? this.libro.descripcion.slice(0, limite) + '…'
        : this.libro.descripcion
    }
  },
  methods: {
    confirmarEliminacion() {
      const confirmado = window.confirm(`¿Eliminar el libro "${this.libro.titulo}"?`)
      if (confirmado) {
        this.$emit('eliminar', this.libro.id)
      }
    }
  }
}
</script>

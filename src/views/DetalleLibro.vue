<template>
  <div class="contenedor">
    <div v-if="libro" class="tarjeta">
      <span class="tarjeta-libro__categoria">{{ libro.categoria }} · {{ libro.tipo }}</span>
      <h2>{{ libro.titulo }}</h2>
      <p><strong>Autor:</strong> {{ libro.autor }}</p>
      <p v-if="libro.fechaPublicacion"><strong>Año de publicación:</strong> {{ libro.fechaPublicacion }}</p>
      <p><strong>Descripción:</strong></p>
      <p>{{ libro.descripcion || 'Sin descripción disponible.' }}</p>
      <router-link to="/libros" class="boton boton--secundario">
        &larr; Volver al listado
      </router-link>
    </div>

    <div v-else class="tarjeta mensaje-vacio">
      <p>No se encontró ningún libro con el identificador "{{ id }}".</p>
      <router-link to="/libros" class="boton boton--primario">
        Volver al listado
      </router-link>
    </div>
  </div>
</template>

<script>
import { obtenerLibroPorId } from '@/store/libros'

export default {
  name: 'DetalleLibro',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    libro() {
      return obtenerLibroPorId(this.id)
    }
  }
}
</script>

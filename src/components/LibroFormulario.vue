<template>
  <div>
    <form class="formulario" @submit.prevent="manejarEnvio">
      <div class="campo">
        <label for="titulo">Título</label>
        <input
          id="titulo"
          v-model="nuevoLibro.titulo"
          type="text"
          placeholder="Ej: El principito"
          @keydown.enter.prevent
          @keyup.enter="manejarEnvio"
        />
      </div>

      <div class="campo">
        <label for="autor">Autor</label>
        <input
          id="autor"
          v-model="nuevoLibro.autor"
          type="text"
          placeholder="Ej: Antoine de Saint-Exupéry"
          @keydown.enter.prevent
          @keyup.enter="manejarEnvio"
        />
      </div>

      <div class="campo">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="nuevoLibro.categoria" @change="nuevoLibro.tipo = ''">
          <option value="" disabled>Selecciona una categoría</option>
          <option v-for="categoria in categorias" :key="categoria" :value="categoria">
            {{ categoria }}
          </option>
        </select>
      </div>

      <div class="campo">
        <label for="tipo">Tipo</label>
        <select id="tipo" v-model="nuevoLibro.tipo" :disabled="!nuevoLibro.categoria">
          <option value="" disabled>
            {{ nuevoLibro.categoria ? 'Selecciona un tipo' : 'Primero elige una categoría' }}
          </option>
          <option v-for="tipo in tiposDisponibles" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
      </div>

      <div class="campo">
        <label for="fechaPublicacion">Año de publicación (opcional)</label>
        <input
          id="fechaPublicacion"
          v-model="nuevoLibro.fechaPublicacion"
          type="text"
          placeholder="Ej: 1943"
        />
      </div>

      <div class="campo">
        <label for="descripcion">Descripción (opcional)</label>
        <textarea
          id="descripcion"
          v-model="nuevoLibro.descripcion"
          placeholder="Breve descripción del libro"
        ></textarea>
      </div>

      <p v-for="error in errores" :key="error" class="mensaje-error">
        {{ error }}
      </p>

      <div>
        <button type="button" class="boton boton--primario" @click="manejarEnvio">
          Agregar libro
        </button>
        <button
          type="button"
          class="boton boton--secundario"
          style="margin-left: 0.5rem;"
          @click="mostrarVistaPrevia = !mostrarVistaPrevia"
        >
          {{ mostrarVistaPrevia ? 'Ocultar' : 'Mostrar' }} vista previa
        </button>
      </div>
    </form>

    <!-- v-show demuestra ocultar/mostrar sin desmontar el bloque del DOM -->
    <div v-show="mostrarVistaPrevia" class="vista-previa seccion">
      <h4>Vista previa en tiempo real</h4>
      <p><strong>Título:</strong> {{ nuevoLibro.titulo || 'Sin título' }}</p>
      <p><strong>Autor:</strong> {{ nuevoLibro.autor || 'Autor no especificado' }}</p>
      <p><strong>Categoría:</strong> {{ nuevoLibro.categoria || 'Sin categoría' }} / {{ nuevoLibro.tipo || 'Sin tipo' }}</p>
      <p><strong>Descripción:</strong> {{ nuevoLibro.descripcion || 'Sin descripción' }}</p>
    </div>
  </div>
</template>

<script>
import { CATEGORIAS, TIPOS_POR_CATEGORIA } from '@/store/libros'

const LIBRO_VACIO = {
  titulo: '',
  autor: '',
  categoria: '',
  tipo: '',
  descripcion: '',
  fechaPublicacion: ''
}

export default {
  name: 'LibroFormulario',
  emits: ['agregar-libro'],
  data() {
    return {
      nuevoLibro: { ...LIBRO_VACIO },
      categorias: CATEGORIAS,
      errores: [],
      mostrarVistaPrevia: true
    }
  },
  computed: {
    tiposDisponibles() {
      return TIPOS_POR_CATEGORIA[this.nuevoLibro.categoria] || []
    }
  },
  methods: {
    validar() {
      const errores = []
      if (!this.nuevoLibro.titulo.trim()) {
        errores.push('Debes ingresar el título del libro.')
      }
      if (!this.nuevoLibro.autor.trim()) {
        errores.push('Debes ingresar el autor del libro.')
      }
      if (!this.nuevoLibro.categoria) {
        errores.push('Debes seleccionar una categoría.')
      }
      if (this.nuevoLibro.categoria && !this.nuevoLibro.tipo) {
        errores.push('Debes seleccionar un tipo.')
      }
      this.errores = errores
      return errores.length === 0
    },
    manejarEnvio() {
      if (!this.validar()) return

      this.$emit('agregar-libro', { ...this.nuevoLibro })
      this.reiniciarFormulario()
    },
    reiniciarFormulario() {
      this.nuevoLibro = { ...LIBRO_VACIO }
      this.errores = []
    }
  }
}
</script>

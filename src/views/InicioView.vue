<template>
  <div class="contenedor">
    <section class="seccion">
      <h2 class="seccion__titulo">Bienvenido a {{ nombreApp }}</h2>
      <p>{{ descripcionApp }}</p>
      <p>
        Hola, <strong>{{ usuario.nombre }}</strong>. Explora el catálogo de libros,
        agrega tus propios títulos y organiza tu biblioteca personal.
      </p>
      <router-link to="/libros" class="boton boton--primario">
        Ver listado de libros
      </router-link>
    </section>

    <section class="seccion">
      <h2 class="seccion__titulo">📊 Resumen de gestión — Editorial Nova</h2>
      <p>Indicadores calculados en tiempo real a partir del catálogo (propiedades <code>computed</code>).</p>

      <div class="indicadores-grid">
        <div class="tarjeta indicador">
          <h3>📚 Total de libros</h3>
          <p class="indicador__valor">{{ totalLibros }}</p>
          <p class="indicador__descripcion">Libros registrados en el sistema</p>
        </div>

        <div class="tarjeta indicador">
          <h3>🏷️ Por categoría</h3>
          <ul class="indicador__lista">
            <li v-for="(cantidad, categoria) in librosPorCategoria" :key="categoria">
              <span>{{ categoria }}</span> <strong>{{ cantidad }}</strong>
            </li>
          </ul>
        </div>

        <div class="tarjeta indicador">
          <h3>🎯 Por tipo</h3>
          <ul v-if="Object.keys(librosPorTipo).length" class="indicador__lista">
            <li v-for="(cantidad, tipo) in librosPorTipo" :key="tipo">
              <span>{{ tipo }}</span> <strong>{{ cantidad }}</strong>
            </li>
          </ul>
          <p v-else class="mensaje-vacio">Aún no hay libros clasificados por tipo.</p>
        </div>

        <div class="tarjeta indicador">
          <h3>📈 Promedio por categoría</h3>
          <p class="indicador__valor">{{ promedioLibrosPorCategoria.toFixed(2) }}</p>
          <p class="indicador__descripcion">Libros promedio por cada categoría</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { obtenerLibros, CATEGORIAS } from '@/store/libros'

export default {
  name: 'InicioView',
  data() {
    return {
      nombreApp: 'BookList',
      descripcionApp: 'Un gestor de libros interactivo construido con Vue.js, pensado para practicar componentes, reactividad y enrutamiento.',
      usuario: {
        nombre: 'Admin Editorial Nova'
      },
      // Referencia al mismo arreglo reactivo del store: los indicadores se
      // recalculan solos al agregar/eliminar libros desde /libros.
      libros: obtenerLibros()
    }
  },
  computed: {
    totalLibros() {
      return this.libros.length
    },
    librosPorCategoria() {
      const resultado = {}
      CATEGORIAS.forEach(categoria => {
        resultado[categoria] = 0
      })
      this.libros.forEach(libro => {
        if (Object.prototype.hasOwnProperty.call(resultado, libro.categoria)) {
          resultado[libro.categoria]++
        }
      })
      return resultado
    },
    librosPorTipo() {
      const resultado = {}
      this.libros.forEach(libro => {
        resultado[libro.tipo] = (resultado[libro.tipo] || 0) + 1
      })
      return resultado
    },
    promedioLibrosPorCategoria() {
      return this.totalLibros / CATEGORIAS.length
    }
  },
  mounted() {
    console.log('✅ App montada correctamente')
    console.log('👤 Usuario:', this.usuario.nombre)
    console.log('📚 Libros iniciales:', this.libros.length)
  }
}
</script>

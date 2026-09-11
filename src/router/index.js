import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '@/views/InicioView.vue'
import ListaLibros from '@/views/ListaLibros.vue'
import DetalleLibro from '@/views/DetalleLibro.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView
  },
  {
    path: '/libros',
    name: 'lista-libros',
    component: ListaLibros
  },
  {
    path: '/libros/:id',
    name: 'detalle-libro',
    component: DetalleLibro,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

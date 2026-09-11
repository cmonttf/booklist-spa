import { reactive } from 'vue'

// Estado reactivo centralizado (Model del patrón MVVM).
// Se comparte entre vistas mediante un módulo importado: alcance suficiente
// para esta SPA sin necesidad de Vuex/Pinia.
let siguienteId = 6

const estado = reactive({
  libros: [
    {
      id: 1,
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      categoria: 'Ficción',
      tipo: 'Novela',
      descripcion: 'Las aventuras del ingenioso hidalgo y su fiel escudero Sancho Panza.',
      fechaPublicacion: '1605'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      categoria: 'Ficción',
      tipo: 'Novela',
      descripcion: 'Una distopía sobre la vigilancia totalitaria y el control del pensamiento.',
      fechaPublicacion: '1949'
    },
    {
      id: 3,
      titulo: 'Sapiens',
      autor: 'Yuval Noah Harari',
      categoria: 'No Ficción',
      tipo: 'Ensayo',
      descripcion: 'Un recorrido por la historia de la humanidad desde la Edad de Piedra hasta la actualidad.',
      fechaPublicacion: '2011'
    },
    {
      id: 4,
      titulo: 'JavaScript: The Good Parts',
      autor: 'Douglas Crockford',
      categoria: 'Técnico',
      tipo: 'Manual',
      descripcion: 'Una guía sobre las mejores características del lenguaje JavaScript.',
      fechaPublicacion: '2008'
    },
    {
      id: 5,
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      categoria: 'Ficción',
      tipo: 'Cuento',
      descripcion: 'Un aviador perdido en el desierto conoce a un pequeño príncipe de otro planeta.',
      fechaPublicacion: '1943'
    }
  ]
})

export function obtenerLibros() {
  return estado.libros
}

export function obtenerLibroPorId(id) {
  return estado.libros.find(libro => libro.id === Number(id))
}

export function agregarLibro(datosLibro) {
  const libro = {
    id: siguienteId++,
    titulo: datosLibro.titulo.trim(),
    autor: datosLibro.autor.trim(),
    categoria: datosLibro.categoria,
    tipo: datosLibro.tipo,
    descripcion: (datosLibro.descripcion || '').trim(),
    fechaPublicacion: (datosLibro.fechaPublicacion || '').trim()
  }
  estado.libros.push(libro)
  console.log('✅ Libro agregado:', libro)
  console.log('📊 Total actual:', estado.libros.length)
  return libro
}

export function eliminarLibro(id) {
  const indice = estado.libros.findIndex(libro => libro.id === id)
  if (indice === -1) {
    console.error('Libro no encontrado')
    return
  }
  const [libroEliminado] = estado.libros.splice(indice, 1)
  console.log('🗑️ Libro eliminado:', libroEliminado)
  console.log('📊 Total actual:', estado.libros.length)
}

// Categoría: grupo editorial principal. Tipo: subtipo específico dentro de esa
// categoría. Editorial Nova usa esta jerarquía para sus indicadores de gestión.
export const CATEGORIAS = ['Ficción', 'No Ficción', 'Técnico']

export const TIPOS_POR_CATEGORIA = {
  Ficción: ['Novela', 'Cuento', 'Relato'],
  'No Ficción': ['Ensayo', 'Biografía', 'Historia'],
  Técnico: ['Manual', 'Guía', 'Referencia']
}

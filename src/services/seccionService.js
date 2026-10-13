import api from './api'

// Secciones (M2.4, solo DIRECTOR). Cada sección pertenece a un año lectivo,
// un grado del catálogo oficial y un docente responsable.
export const TURNOS = [
  { valor: 'matutino', etiqueta: 'Matutino' },
  { valor: 'vespertino', etiqueta: 'Vespertino' },
]

// D-S3: límite provisional, pendiente de confirmar con la institución
export const CAPACIDAD_MINIMA = 1
export const CAPACIDAD_MAXIMA = 50

export const seccionService = {
  // filtros: { anio_lectivo_id, grado_id, turno }. Sin año, el backend usa el año activo.
  // Devuelve { anio_lectivo_id, secciones } con matriculados y cupos_disponibles.
  async listar(filtros = {}) {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== '' && v !== null && v !== undefined))
    const { data } = await api.get('/secciones', { params })
    return data
  },

  async obtener(id) {
    const { data } = await api.get(`/secciones/${id}`)
    return data.seccion
  },

  // { nombre, capacidad, turno, anio_lectivo_id, grado_id, profesor_id }
  async crear(datos) {
    const { data } = await api.post('/secciones', datos)
    return data
  },

  async actualizar(id, datos) {
    const { data } = await api.put(`/secciones/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/secciones/${id}`)
    return data
  },
}

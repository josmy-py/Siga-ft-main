import api from './api'

// Asignación académica (M4). El DIRECTOR administra la carga de los docentes;
// cada DOCENTE consulta solo la suya. La API responde 409 ante conflictos (materia
// que ya imparte otro docente, sección con otro plan, asignación con notas) y
// 422 con `errors` por campo cuando los datos no son válidos.
export const asignacionService = {
  // filtros: { anio_lectivo_id, profesor_id, seccion_id, grado_id }. Sin año, el activo.
  // Respuesta: { anio_lectivo_id, asignaciones }
  async listar(filtros = {}) {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== '' && v != null))
    const { data } = await api.get('/asignaciones', { params })
    return data
  },

  async crear(datos) {
    const { data } = await api.post('/asignaciones', datos)
    return data
  },

  // D-A3: cambia solo el docente; las evaluaciones y notas se conservan
  async cambiarDocente(id, profesorId) {
    const { data } = await api.put(`/asignaciones/${id}`, { profesor_id: profesorId })
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/asignaciones/${id}`)
    return data
  },

  // Guarda de una vez la carga del docente en el año: crea las marcadas y quita las
  // desmarcadas. items: [{ seccion_id, asignatura_id }]. Todo o nada.
  async guardarCarga(profesorId, anioLectivoId, items) {
    const { data } = await api.put(`/profesores/${profesorId}/carga`, {
      anio_lectivo_id: anioLectivoId,
      asignaciones: items,
    })
    return data
  },

  // Carga del docente en sesión: { profesor, anio_lectivo, asignaciones, secciones }
  async miCarga(anioLectivoId = null) {
    const params = anioLectivoId ? { anio_lectivo_id: anioLectivoId } : {}
    const { data } = await api.get('/docente/carga', { params })
    return data
  },
}

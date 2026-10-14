import api from './api'

// M5: estudiantes. El ENCARGADO ve y gestiona solo los de su cuenta; el DIRECTOR,
// todos. La API responde 404 a lo ajeno, 409 ante reglas de negocio (duplicado,
// estudiante con matrículas) y 422 con `errors` por campo.
export const estudianteService = {
  // filtros: { q (nombre o NIE), estado }. Respuesta: lista de estudiantes
  async listar(filtros = {}) {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== '' && v != null))
    const { data } = await api.get('/estudiantes', { params })
    return data.estudiantes
  },

  // { estudiante (con padres y matrículas), permisos: { editar_nie, eliminar, cambiar_cuenta } }
  async obtener(id) {
    const { data } = await api.get(`/estudiantes/${id}`)
    return data
  },

  // datos: { nombre, fecha_nacimiento, genero, distrito_id, nie, direccion, canton }
  async crear(datos) {
    const { data } = await api.post('/estudiantes', datos)
    return data
  },

  async actualizar(id, datos) {
    const { data } = await api.put(`/estudiantes/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/estudiantes/${id}`)
    return data
  },

}

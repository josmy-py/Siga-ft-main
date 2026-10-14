import api from './api'

// M8 Conducta (diagrama: Conducta.registrar() y actualizar(descripcion, valoracion)).
// Una conducta por estudiante y periodo; la registran los docentes de la sección.
// La API responde 409 si el año lectivo no está activo y 422 con `errors` por campo.
export const conductaService = {
  // { seccion, periodos, periodo, editable, valoraciones, estudiantes: [{ matricula_id, estudiante, conducta }] }
  async listar(seccionId, periodoId = null) {
    const params = periodoId ? { periodo_escolar_id: periodoId } : {}
    const { data } = await api.get(`/docente/secciones/${seccionId}/conducta`, { params })
    return data
  },

  // conductas: [{ matricula_id, descripcion, valoracion }]
  async guardar(seccionId, periodoId, conductas) {
    const { data } = await api.put(`/docente/secciones/${seccionId}/conducta`, {
      periodo_escolar_id: periodoId,
      conductas,
    })
    return data
  },
}

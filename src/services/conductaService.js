import api from './api'

// M8 Conducta (diagrama: Conducta.registrar()). Pedido de Josmy (23/10/2026): 5 criterios
// fijos con su valoración, una sola vez por estudiante y periodo, con el periodo cerrado.
// La API responde 409 si el periodo no está cerrado, el año no está activo o ya se
// registró, y 422 con `errors` por campo.
export const conductaService = {
  // { seccion, periodos, periodo, editable, motivo, valoraciones, criterios,
  //   estudiantes: [{ matricula_id, estudiante, registrada, criterios: [{ criterio, valoracion }] }] }
  async listar(seccionId, periodoId = null) {
    const params = periodoId ? { periodo_escolar_id: periodoId } : {}
    const { data } = await api.get(`/docente/secciones/${seccionId}/conducta`, { params })
    return data
  },

  // valoraciones: una por criterio, en el orden de `criterios`
  async registrar(seccionId, periodoId, matriculaId, valoraciones) {
    const { data } = await api.put(`/docente/secciones/${seccionId}/conducta`, {
      periodo_escolar_id: periodoId,
      matricula_id: matriculaId,
      valoraciones,
    })
    return data
  },
}

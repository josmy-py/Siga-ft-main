import api from './api'
import { asignacionService } from './asignacionService'
import { seccionService } from './seccionService'

// M12 Reportes de notas y de conducta por sección y periodo.
// ambito "director": cualquier sección. ambito "docente": sus secciones (y en
// el de notas, solo sus materias).
const prefijo = (ambito) => (ambito === 'docente' ? '/docente/reportes' : '/reportes')

export const reporteService = {
  // [{ id, nombre, grado, anio_lectivo_id }] del año activo
  async secciones(ambito) {
    const lista =
      ambito === 'docente'
        ? ((await asignacionService.miCarga()).secciones ?? []).map((s) => s.seccion)
        : (await seccionService.listar()).secciones ?? []
    return lista.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      grado: s.grado?.nombre ?? '',
      anio_lectivo_id: s.anio_lectivo_id,
    }))
  },

  async periodos(anioLectivoId) {
    const { data } = await api.get(`/anios-lectivos/${anioLectivoId}/periodos`)
    return data.periodos ?? data
  },

  // { seccion, periodo, materias, estudiantes: [{ estudiante, promedios: { asignacion_id: promedio }, promedio, nota_final }] }
  async notas(ambito, seccionId, periodoId) {
    const { data } = await api.get(`${prefijo(ambito)}/notas`, {
      params: { seccion_id: seccionId, periodo_escolar_id: periodoId },
    })
    return data
  },

  // { seccion, periodo, estudiantes: [{ estudiante, conducta }] }
  async conducta(ambito, seccionId, periodoId) {
    const { data } = await api.get(`${prefijo(ambito)}/conducta`, {
      params: { seccion_id: seccionId, periodo_escolar_id: periodoId },
    })
    return data
  },
}

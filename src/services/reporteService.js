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

  // Reporte Académico (director): indicadores del nivel en el período (boletas, aprueba con 7)
  async academicoIndicadores(nivel, periodoId) {
    const { data } = await api.get('/reportes/academico/indicadores', {
      params: { nivel, periodo_escolar_id: periodoId },
    })
    return data
  },

  // Reporte Académico (director): PDF generado con dompdf en el backend
  async academicoPdf(datos) {
    const { data } = await api.post('/reportes/academico/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Informe Profesor (docente): PDF generado con dompdf en el backend
  async informeProfesorPdf(datos) {
    const { data } = await api.post('/docente/reportes/informe-profesor/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Libreta de notas de un estudiante (docente): PDF generado con dompdf en el backend
  async libretaNotasPdf(datos) {
    const { data } = await api.post('/docente/reportes/libreta-notas/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Reporte de Rendimiento de una materia (docente): PDF generado con dompdf en el backend
  async rendimientoPdf(datos) {
    const { data } = await api.post('/docente/reportes/rendimiento/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Reporte Docente (director): total de docentes y activos del año del período
  async docenteIndicadores(periodoId) {
    const { data } = await api.get('/reportes/docente/indicadores', { params: { periodo_escolar_id: periodoId } })
    return data
  },

  // Reporte Docente (director): PDF generado con dompdf en el backend
  async docentePdf(datos) {
    const { data } = await api.post('/reportes/docente/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Reporte de Conducta de un estudiante (docente): PDF generado con dompdf en el backend
  async conductaPdf(datos) {
    const { data } = await api.post('/docente/reportes/conducta/pdf', datos, { responseType: 'blob' })
    return data
  },

  // Reporte de Conducta (director): total de estudiantes con matrícula aprobada en el año del período
  async conductaIndicadores(periodoId) {
    const { data } = await api.get('/reportes/conducta/indicadores', { params: { periodo_escolar_id: periodoId } })
    return data
  },

  // Reporte Institucional (director): indicadores del nivel en el período
  async institucionalIndicadores(nivel, periodoId) {
    const { data } = await api.get('/reportes/institucional/indicadores', { params: { nivel, periodo_escolar_id: periodoId } })
    return data
  },
}

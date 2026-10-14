import api from './api'

// M10 y M11: consultas sobre un estudiante. El encargado solo ve a sus
// estudiantes (lo ajeno responde 404); el director, a cualquiera.
export const consultaService = {
  // Consultar notas (Matricula.obtenerNotas()). Sin matrícula: la aprobada más reciente.
  // { estudiante, matriculas, matricula, periodos, materias, nota_final }
  async notas(estudianteId, matriculaId = null) {
    const params = matriculaId ? { matricula_id: matriculaId } : {}
    const { data } = await api.get(`/estudiantes/${estudianteId}/notas`, { params })
    return data
  },

  // Asignaturas de la sección de la matrícula aprobada: { estudiante, matriculas, matricula, asignaturas: [{ asignatura, docente }] }
  async asignaturas(estudianteId, matriculaId = null) {
    const params = matriculaId ? { matricula_id: matriculaId } : {}
    const { data } = await api.get(`/estudiantes/${estudianteId}/asignaturas`, { params })
    return data
  },

  // Consultar conducta: { estudiante, matriculas, matricula, periodos: [{ periodo, conducta }] }
  async conducta(estudianteId, matriculaId = null) {
    const params = matriculaId ? { matricula_id: matriculaId } : {}
    const { data } = await api.get(`/estudiantes/${estudianteId}/conducta`, { params })
    return data
  },

  // Consultar expediente (solo DIRECTOR): { estudiante, resultados: [{ matricula_id, nota_final, conducta }] }
  async expediente(estudianteId) {
    const { data } = await api.get(`/estudiantes/${estudianteId}/expediente`)
    return data
  },

  // Matricula.generarComprobante(): { comprobante, fecha, estado, estudiante, grado, seccion, ... }
  async comprobante(matriculaId) {
    const { data } = await api.get(`/matriculas/${matriculaId}/comprobante`)
    return data
  },
}

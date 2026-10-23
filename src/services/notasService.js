import api from './api'

// Notas del docente (M7, diagrama de clases): Profesor.obtenerEstudiantes(asignacion),
// Evaluacion (crear, eliminar, validarDisponibilidad) y Calificacion (registrar,
// actualizar). Solo con las asignaciones propias (lo ajeno responde 404). La API
// responde 409 si el año lectivo no está activo o la evaluación ya tiene notas, y
// 422 con `errors` por campo cuando los datos no son válidos.
export const notasService = {
  // { asignacion, periodos, estudiantes: [{ id, estudiante: { nombre, nie, genero } }] }
  async estudiantes(asignacionId) {
    const { data } = await api.get(`/docente/asignaciones/${asignacionId}/estudiantes`)
    return data
  },

  // Mis estudiantes > Ver: { estudiante: { nombre, nie, genero, fecha_nacimiento }, padres: [{ nombre, parentesco, dui,
  // telefono, email }], encargado: { nombre, dui, parentesco, telefono } | null, es_trasladado }
  async fichaEstudiante(asignacionId, matriculaId) {
    const { data } = await api.get(`/docente/asignaciones/${asignacionId}/estudiantes/${matriculaId}`)
    return data
  },

  // { periodo, evaluaciones, porcentaje_usado, porcentaje_disponible, editable }
  async evaluaciones(asignacionId, periodoId) {
    const { data } = await api.get(`/docente/asignaciones/${asignacionId}/evaluaciones`, {
      params: { periodo_escolar_id: periodoId },
    })
    return data
  },

  // datos: { nombre, porcentaje, periodo_escolar_id }. Las evaluaciones del periodo suman como máximo 100 %.
  async crearEvaluacion(asignacionId, datos) {
    const { data } = await api.post(`/docente/asignaciones/${asignacionId}/evaluaciones`, datos)
    return data
  },

  async eliminarEvaluacion(id) {
    const { data } = await api.delete(`/docente/evaluaciones/${id}`)
    return data
  },

  // { evaluacion, editable, estudiantes: [{ matricula_id, estudiante, nota }] }
  async calificaciones(evaluacionId) {
    const { data } = await api.get(`/docente/evaluaciones/${evaluacionId}/calificaciones`)
    return data
  },

  // notas: [{ matricula_id, nota }] con nota de 0 a 10 (dos decimales) o null para dejarla vacía
  async guardarCalificaciones(evaluacionId, notas) {
    const { data } = await api.put(`/docente/evaluaciones/${evaluacionId}/calificaciones`, { notas })
    return data
  },

  // M9 Libreta: { completa, motivo, porcentaje_usado, editable, estudiantes: [{ matricula_id, estudiante, promedio, faltan, boleta }] }
  async libreta(asignacionId, periodoId) {
    const { data } = await api.get(`/docente/asignaciones/${asignacionId}/libreta`, {
      params: { periodo_escolar_id: periodoId },
    })
    return data
  },

  // Boleta.crear() / actualizar() de la materia en el periodo: { creadas, actualizadas }
  async generarLibreta(asignacionId, periodoId) {
    const { data } = await api.post(`/docente/asignaciones/${asignacionId}/libreta`, {
      periodo_escolar_id: periodoId,
    })
    return data
  },
}

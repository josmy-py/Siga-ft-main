import api from './api'

// M6: matrícula (API real). El encargado llena la solicitud sin sección; la
// dirección asigna la sección (solo grados permitidos y secciones con cupo) al
// aprobar. Errores 422 por campo con erroresCampos(), 409 reglas de estado.
export const matriculaService = {
  // filtros: { estado, ingreso, anio_lectivo_id, grado_id, q } -> { matriculas, resumen }
  async listar(filtros = {}) {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== '' && v != null))
    const { data } = await api.get('/matriculas', { params })
    return data
  },

  // Expediente completo con responsable y archivos
  async obtener(id) {
    const { data } = await api.get(`/matriculas/${id}`)
    return data
  },

  // { anio_lectivo, ingreso, grados, especialidad_id, especialidad_libre, mensaje, permitido, nie, responsable }
  async opciones(estudianteId) {
    const { data } = await api.get(`/matriculas/estudiantes/${estudianteId}/opciones`)
    return data
  },

  // Reingreso: busca al estudiante solo por NIE (también de otra cuenta si ya tuvo matrícula aprobada).
  // { id, nombre, nie, fecha_nacimiento, genero, direccion, distrito, municipio, departamento, propio } o null
  async buscarNie(nie) {
    try {
      const { data } = await api.post('/matriculas/buscar-nie', { nie })
      return data.estudiante
    } catch (error) {
      if (error.response?.status === 404) return null
      throw error
    }
  },

  // datos: { ingreso, estudiante_id, nie, especialidad_id, enfermedad_id, discapacidades[], es_trasladado, foto, documento }
  async solicitar(datos) {
    const { data } = await api.post('/matriculas', aFormData(datos))
    return data
  },

  async cancelar(id) {
    const { data } = await api.delete(`/matriculas/${id}`)
    return data
  },

  // Solo DIRECTOR: { grados: [{ id, nombre, turnos: [{ turno, secciones: [{ id, nombre, capacidad, cupos_disponibles }] }] }], mensaje }
  async seccionesParaAsignar(id) {
    const { data } = await api.get(`/matriculas/${id}/secciones`)
    return data
  },

  // Solo DIRECTOR
  // nie: obligatorio si el estudiante no lo tiene (Nuevo ingreso sin traslado); se guarda en estudiantes
  async aprobar(id, seccionId, nie = null) {
    const { data } = await api.put(`/matriculas/${id}/estado`, { estado: 'aprobado', seccion_id: seccionId, ...(nie ? { nie } : {}) })
    return data
  },

  async rechazar(id) {
    const { data } = await api.put(`/matriculas/${id}/estado`, { estado: 'rechazado' })
    return data
  },

  // Foto o documentación desde el disco privado, como URL local para verla
  async archivo(id, tipo) {
    const { data } = await api.get(`/matriculas/${id}/archivos/${tipo}`, { responseType: 'blob' })
    return URL.createObjectURL(data)
  },
}

function aFormData(datos) {
  const form = new FormData()
  for (const [campo, valor] of Object.entries(datos)) {
    if (valor === undefined || valor === null || valor === '') continue
    if (Array.isArray(valor)) {
      valor.forEach((v) => form.append(`${campo}[]`, v))
    } else if (typeof valor === 'boolean') {
      form.append(campo, valor ? '1' : '0')
    } else {
      form.append(campo, valor)
    }
  }
  return form
}

export const TURNOS = { matutino: 'Mañana', vespertino: 'Tarde' }

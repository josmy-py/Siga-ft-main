import api from './api'

// Portal director > Constancias. Los PDF se generan con dompdf en el backend.
export const constanciaService = {
  // { nombre, nie, nivel, opcion, grado, seccion, anio_lectivo } del egresado con ese NIE
  // (404 si no está registrado; 409 con el motivo si aún no terminó el bachillerato)
  async egresado(nie) {
    const { data } = await api.get('/constancias/egresado', { params: { nie } })
    return data
  },

  // Constancia de Egresado: PDF (blob)
  async egresadoPdf(datos) {
    const { data } = await api.post('/constancias/egresado/pdf', datos, { responseType: 'blob' })
    return data
  },

  // { nombre, nie, anios: ['2026', '2025'] } años lectivos de sus matrículas aprobadas
  // (404 si no está registrado; 409 si no tiene matrículas aprobadas)
  async conducta(nie) {
    const { data } = await api.get('/constancias/conducta', { params: { nie } })
    return data
  },

  // Constancia de Buena Conducta: PDF (blob)
  async conductaPdf(datos) {
    const { data } = await api.post('/constancias/conducta/pdf', datos, { responseType: 'blob' })
    return data
  },
}

import api from './api'

// Docentes (solo DIRECTOR). Al registrar un docente el backend crea su cuenta
// DOCENTE y le asigna el código PROF-001, PROF-002...
export const profesorService = {
  async listar(buscar = '') {
    const params = buscar ? { buscar } : {}
    const { data } = await api.get('/profesores', { params })
    return data.profesores
  },

  async obtener(id) {
    const { data } = await api.get(`/profesores/${id}`)
    return data.profesor
  },

  // nombre, dui, email, password (si la cuenta es nueva), fecha_nacimiento, telefono y direccion
  async crear(datos) {
    const { data } = await api.post('/profesores', datos)
    return data
  },

  // Igual que crear, sin dui ni email: el código, el DUI y la cuenta no se modifican
  async actualizar(id, datos) {
    const { data } = await api.put(`/profesores/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/profesores/${id}`)
    return data
  },
}

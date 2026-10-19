import api from './api'

// Docentes (solo DIRECTOR). El profesor se vincula con una cuenta DOCENTE ya
// creada en Usuarios; el backend le asigna el código PROF-001, PROF-002...
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

  // Cuentas DOCENTE que todavía no tienen profesor
  async cuentasDisponibles() {
    const { data } = await api.get('/profesores/cuentas-disponibles')
    return data.cuentas
  },

  // nombre, dui, user_id (cuenta DOCENTE), fecha_nacimiento, telefono y direccion
  async crear(datos) {
    const { data } = await api.post('/profesores', datos)
    return data
  },

  // Igual que crear, sin dui: el código y el DUI no se modifican; la cuenta se puede cambiar
  async actualizar(id, datos) {
    const { data } = await api.put(`/profesores/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/profesores/${id}`)
    return data
  },
}

import api from './api'

// Gestión de cuentas (solo DIRECTOR; el backend lo exige en cada ruta)
export const usuarioService = {
  async listar(filtros = {}) {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
    const { data } = await api.get('/usuarios', { params })
    return data.usuarios
  },

  async obtener(id) {
    const { data } = await api.get(`/usuarios/${id}`)
    return data.usuario
  },

  // email, password y rol (campos del diagrama)
  async crear(datos) {
    const { data } = await api.post('/usuarios', datos)
    return data
  },

  // email y rol
  async actualizar(id, datos) {
    const { data } = await api.put(`/usuarios/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/usuarios/${id}`)
    return data
  },
}

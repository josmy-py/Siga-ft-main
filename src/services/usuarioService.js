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

  // nombre, dui, email, rol. La persona define su contraseña con el enlace del correo.
  async crear(datos) {
    const { data } = await api.post('/usuarios', datos)
    return data
  },

  // nombre, email, rol (el DUI no es editable)
  async actualizar(id, datos) {
    const { data } = await api.put(`/usuarios/${id}`, datos)
    return data
  },

  async cambiarEstado(id, estado) {
    const { data } = await api.patch(`/usuarios/${id}/estado`, { estado })
    return data
  },

  async reenviarEnlace(id) {
    const { data } = await api.post(`/usuarios/${id}/reenviar-enlace`)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/usuarios/${id}`)
    return data
  },
}

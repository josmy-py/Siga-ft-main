import api from './api'

// M5 (D3): padres y madres (tabla padres, vinculados por parientes), encargados que no
// son padre ni madre, y el perfil familiar de la cuenta en sesión.
export const familiaService = {
  // { cuenta: { nombre, email, dui }, padre, encargado, estudiantes }
  async perfil() {
    const { data } = await api.get('/familia/perfil')
    return data
  },

  async padres(q = '') {
    const { data } = await api.get('/padres', { params: q ? { q } : {} })
    return data.padres
  },

  // Busca por DUI solo dentro de la familia de la cuenta (404 si no está)
  async buscarPadre(dui) {
    try {
      const { data } = await api.post('/padres/buscar-dui', { dui })
      return data.padre
    } catch (error) {
      if (error.response?.status === 404) return null
      throw error
    }
  },

  // datos: { nombre, dui, telefono, email, es_encargado, estudiante_id, parentesco }
  async registrarPadre(datos) {
    const { data } = await api.post('/padres', datos)
    return data
  },

  async actualizarPadre(id, datos) {
    const { data } = await api.put(`/padres/${id}`, datos)
    return data
  },

  // Vincula por DUI a una persona ya registrada en la familia (o, si es la dirección, a cualquiera)
  async vincular(estudianteId, dui, parentesco) {
    const { data } = await api.post(`/estudiantes/${estudianteId}/padres`, { dui, parentesco })
    return data
  },

  async vincularPorId(estudianteId, padreId, parentesco) {
    const { data } = await api.post('/parientes', { estudiante_id: estudianteId, padre_id: padreId, parentesco })
    return data
  },

  async desvincular(estudianteId, padreId) {
    const { data } = await api.delete(`/estudiantes/${estudianteId}/padres/${padreId}`)
    return data
  },

  async encargados(q = '') {
    const { data } = await api.get('/encargados', { params: q ? { q } : {} })
    return data.encargados
  },

  // datos: { nombre, parentesco, telefono, dui, direccion }
  async registrarEncargado(datos) {
    const { data } = await api.post('/encargados', datos)
    return data
  },

  async actualizarEncargado(id, datos) {
    const { data } = await api.put(`/encargados/${id}`, datos)
    return data
  },
}

export const PARENTESCOS_ENCARGADO = ['Tío(a)', 'Abuelo(a)', 'Hermano(a)', 'Primo(a)']


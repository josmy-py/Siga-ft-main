import api from './api'

export const estudianteService = {

    async obtenerTodos() {
        const response = await api.get('/estudiantes')
        return response.data
    },

    async obtenerPorId(id) {
        const response = await api.get(`/estudiantes/${id}`)
        return response.data
    },

    async crear(datos) {
        const response = await api.post('/estudiantes', datos)
        return response.data
    },
    async actualizar(id, datos) {
        const response = await api.put(`/estudiantes/${id}`, datos)
        return response.data
    },

    async eliminar(id) {
        const response = await api.delete(`/estudiantes/${id}`)
        return response.data
    }
}
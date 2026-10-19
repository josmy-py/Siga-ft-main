import api from './api';

// M2.2: años lectivos y periodos escolares. Lectura para cualquier cuenta con
// sesión; crear, editar, activar y cerrar el año solo para DIRECTOR. La API
// responde 422 con `errors` por campo, 409 cuando el estado actual no permite la
// operación y 404 si el registro no existe. Las escrituras devuelven { message, ... }.
export const anioLectivoService = {
    async listar() {
        const response = await api.get('/anios-lectivos');
        return response.data.anios_lectivos;
    },

    // { anio_lectivo (con sus periodos), message } (message explica lo que falta)
    async actual() {
        const response = await api.get('/anios-lectivos/actual');
        return response.data;
    },

    async obtener(id) {
        const response = await api.get(`/anios-lectivos/${id}`);
        return response.data.anio_lectivo;
    },

    // { anio, fecha_inicio, fecha_fin }: el año nace sin periodos
    async crear(datos) {
        const response = await api.post('/anios-lectivos', datos);
        return response.data;
    },

    // { anio, fecha_inicio, fecha_fin }
    async actualizar(id, datos) {
        const response = await api.put(`/anios-lectivos/${id}`, datos);
        return response.data;
    },

    async activar(id) {
        const response = await api.post(`/anios-lectivos/${id}/activar`);
        return response.data;
    },

    async cerrar(id) {
        const response = await api.post(`/anios-lectivos/${id}/cerrar`);
        return response.data;
    },

    async eliminar(id) {
        const response = await api.delete(`/anios-lectivos/${id}`);
        return response.data;
    },

    // { nombre_periodo, nivel }
    async agregarPeriodo(id, datos) {
        const response = await api.post(`/anios-lectivos/${id}/periodos`, datos);
        return response.data;
    }
};

export const periodoEscolarService = {
    // { nombre_periodo }
    async actualizar(id, datos) {
        const response = await api.put(`/periodos-escolares/${id}`, datos);
        return response.data;
    },

    async eliminar(id) {
        const response = await api.delete(`/periodos-escolares/${id}`);
        return response.data;
    }
};

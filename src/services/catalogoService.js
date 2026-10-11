import api from './api';
import baseService from './baseService';

// Catálogos de M2.1. Lectura para cualquier cuenta con sesión; crear, editar y
// eliminar solo para DIRECTOR (la API responde 403 a los demás, 409 si el
// registro está en uso y 422 con `errors` por campo si la validación falla).
// Aún no hay pantallas conectadas: los formularios deben migrar a este servicio.
export const gradoService = baseService('/grados');                 // { nombre, orden }
export const especialidadService = baseService('/especialidades');  // { nombre } (máx. 20)
export const discapacidadService = baseService('/discapacidades');  // { nombre }
export const enfermedadService = baseService('/enfermedades');      // { nombre, medicamento }

// División territorial para selects en cascada: departamento -> municipio -> distrito.
// estudiantes guarda solo distrito_id.
export const ubicacionService = {
    async departamentos() {
        const response = await api.get('/departamentos');
        return response.data.departamentos;
    },

    async municipios(departamentoId) {
        const response = await api.get(`/departamentos/${departamentoId}/municipios`);
        return response.data.municipios;
    },

    async distritos(municipioId) {
        const response = await api.get(`/municipios/${municipioId}/distritos`);
        return response.data.distritos;
    },

    async distrito(id) {
        const response = await api.get(`/distritos/${id}`);
        return response.data.distrito;
    }
};

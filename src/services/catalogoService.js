import api from './api';
import baseService from './baseService';

// Catálogos de M2.1. Lectura para cualquier cuenta con sesión; crear, editar y
// eliminar solo para DIRECTOR (la API responde 403 a los demás, 409 si el
// registro está en uso y 422 con `errors` por campo si la validación falla).
// Pantallas en Catálogos (M2.5).
// Grados: el nombre debe ser uno del catálogo oficial (la API devuelve su orden académico)
export const gradoService = {
    ...baseService('/grados'),          // { nombre }

    // [{ nombre, orden, grado_id }] grado_id es null si aún no está registrado
    async catalogo() {
        const response = await api.get('/grados/catalogo');
        return response.data.catalogo;
    }
};
export const especialidadService = baseService('/especialidades');  // { nombre } (máx. 50)
export const discapacidadService = baseService('/discapacidades');  // { nombre } (máx. 50)
export const enfermedadService = baseService('/enfermedades');      // { nombre, medicamento } (máx. 50 cada uno)

// Plan de estudios y asignaturas (M2.3). Cada plan pertenece a un grado y sus
// asignaturas forman el pensum de ese grado; solo un plan vigente (estado true)
// por grado y especialidad (409 si ya existe). especialidad_id solo en Bachillerato.
export const planEstudioService = {
    ...baseService('/plan-estudios'),   // { nombre, grado_id, especialidad_id, estado, fecha_inicio, fecha_fin, fecha_aprobacion, descripcion }

    async listar(filtros = {}) {        // filtros: { grado_id, vigente, sin_grado }
        const response = await api.get('/plan-estudios', { params: filtros });
        return response.data.planes;
    }
};

export const asignaturaService = {
    ...baseService('/asignaturas'),     // { nombre, plan_estudio_id } (nombre único dentro del plan)

    async delPlan(planEstudioId) {
        const response = await api.get('/asignaturas', { params: { plan_estudio_id: planEstudioId } });
        return response.data.asignaturas;
    },

    // Pensum vigente del grado: lo que la asignación académica podrá ofrecer
    async delGrado(gradoId) {
        const response = await api.get('/asignaturas', { params: { grado_id: gradoId } });
        return response.data.asignaturas;
    }
};

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

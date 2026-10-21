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

// Plan de estudios y asignaturas (M2.3), con los campos del diagrama.
// especialidad_id es opcional (planes de bachillerato).
export const planEstudioService = {
    ...baseService('/plan-estudios'),   // { nombre, especialidad_id, estado, fecha_inicio, fecha_fin, fecha_aprobacion, descripcion }

    async listar(filtros = {}) {        // filtros: { vigente }
        const response = await api.get('/plan-estudios', { params: filtros });
        return response.data.planes;
    }
};

// Diagrama ER (21/10/2026): catálogo de asignaturas (solo nombre, sin repetidos)
// y plan_asignaturas, que pone cada asignatura en uno o varios planes.
export const asignaturaService = baseService('/asignaturas');   // { nombre }

export const planAsignaturaService = {
    // create: { plan_estudio_id, nombre } (si la asignatura ya existe en el catálogo se reutiliza)
    // update: { nombre } (cambia la materia solo en ese plan)
    ...baseService('/plan-asignaturas'),

    // [{ id, plan_estudio_id, asignatura_id, nombre, plan_estudio }]; sin plan, las de todos
    async delPlan(planEstudioId = null) {
        const params = planEstudioId ? { plan_estudio_id: planEstudioId } : {};
        const response = await api.get('/plan-asignaturas', { params });
        return response.data.plan_asignaturas;
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

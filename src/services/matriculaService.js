import api from './api';
import baseService from './baseService';

const matriculaCrud = baseService('/matriculas');

const mockCatalogos = {
    grados: [
        { id: 1, nombre: "1er Año", especialidad: "Software" },
        { id: 2, nombre: "2do Año", especialidad: "Software" }
    ],
    turnos: [
        { id: 1, nombre: "Mañana" },
        { id: 2, nombre: "Tarde" }
    ],
    parentescos: [
        { id: 1, nombre: "Madre" },
        { id: 2, nombre: "Padre" }
    ]
};

const mockBusqueda = [
    { id: 10, nombres: "Juan Perez", NIE: "12345678", padre: { id: 5, nombre: "Carlos Perez", dui: "00000000-0" } }
];
const USE_MOCK = true; 

export const matriculaService = {
    
    ...matriculaCrud, 

    async obtenerCatalogos() {
        if (USE_MOCK) {
            return new Promise(resolve => setTimeout(() => resolve({ 
                data: mockCatalogos 
            }), 300));
        }
        const [resGrados, resTurnos, resParentescos] = await Promise.all([
            api.get("/grados"),
            api.get("/turnos"),
            api.get("/parentescos")
        ]);
        return { data: { grados: resGrados.data, turnos: resTurnos.data, parentescos: resParentescos.data } };
    },

    async buscarEstudiante(termino) {
        if (USE_MOCK) {
            return new Promise(resolve => setTimeout(() => resolve({ data: mockBusqueda }), 500));
        }
        const response = await api.get(`/estudiantes/buscar?q=${termino}`);
        return response;
    },

    async enviarMatricula(formData) {
        if (USE_MOCK) {
            console.log("Simulando envío a Laravel...");
            return new Promise(resolve => setTimeout(() => resolve({ data: { message: "Matrícula exitosa" } }), 800));
        }
        return await api.post("/matriculas", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
};
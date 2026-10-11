<script setup>
import { ref, computed } from "vue";

// --- ESTADOS DE LA VISTA ---
const selectedTrimestre = ref("1");
const vistaActiva = ref("calificaciones");
const nombreEncargado = ref("Elena Ruiz");

const hijos = ref([
  {
    id: 1,
    nombre: "Juan Pérez",
    grado: "5° Primaria",
    seccion: "A",
    periodo: "2026",
  },
  {
    id: 2,
    nombre: "María Ruiz",
    grado: "3° Primaria",
    seccion: "B",
    periodo: "2026",
  },
]);

// Manejo del estudiante seleccionado
const hijoSeleccionadoId = ref(hijos.value[0].id);
const hijoSeleccionado = computed(
  () => hijos.value.find((h) => h.id === hijoSeleccionadoId.value) || hijos.value[0],
);

// --- TABLAS DE DATOS ---
const calificaciones = ref([
  {
    asignatura: "Matemática",
    profesor: "Ing. María González",
    nota1: 8.5,
    nota2: 9.0,
    nota3: 8.8,
    promedio: 8.8,
    estado: "Aprobado",
  },
  {
    asignatura: "Ciencias Naturales",
    profesor: "Dra. Ana López",
    nota1: 7.5,
    nota2: 8.2,
    nota3: 9.1,
    promedio: 8.3,
    estado: "Aprobado",
  },
  {
    asignatura: "Estudio Sociales",
    profesor: "Lic. Carlos Ramírez",
    nota1: 8.5,
    nota2: 7.0,
    nota3: 6.8,
    promedio: 6.7,
    estado: "Desaprobado",
  },
  {
    asignatura: "Lenguaje",
    profesor: "Lic. Carlos Ramírez",
    nota1: 6.5,
    nota2: 7.0,
    nota3: 6.3,
    promedio: 6.7,
    estado: "Desaprobado",
  },
  {
    asignatura: "Inglés",
    profesor: "Lic. Patricia Ruiz",
    nota1: 9.5,
    nota2: 9.8,
    nota3: 10.0,
    promedio: 9.8,
    estado: "Aprobado",
  },
]);

const getNotaEstadoClass = (estado) => {
  return estado === "Aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const conductaGeneral = ref([
  {
    descripcion: "Participa activamente en las actividades académicas y extracurriculares.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Demuestra respeto hacia compañeros, docentes y personal de la institución.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Cumple puntualmente con las tareas y responsabilidades asignadas.",
    calificacion: "Bueno",
  },
  {
    descripcion: "Muestra interés por aprender y mejorar continuamente su rendimiento académico.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Mantiene una actitud positiva frente a los desafíos y dificultades.",
    calificacion: "Bueno",
  },
  {
    descripcion: "Respeta las normas de convivencia y el reglamento interno de la institución.",
    calificacion: "Malo",
  },
]);

const getConductaClass = (calificacion) => {
  return (
    {
      Excelente: "bg-green-100 text-green-700",
      Bueno: "bg-blue-100 text-blue-700",
      Malo: "bg-yellow-100 text-yellow-700",
    }[calificacion] || "bg-gray-100 text-gray-700"
  );
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Libreta de Notas</h1>
          </div>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1">
        <!-- PESTAÑAS Y SELECTORES -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <!-- Lado Izquierdo: Pestañas -->
          <div class="flex gap-3 w-full lg:w-auto">
            <button
              @click="vistaActiva = 'calificaciones'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border',
                vistaActiva === 'calificaciones'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400',
              ]"
            >
              <i class="pi pi-book"></i> Calificaciones
            </button>

            <button
              @click="vistaActiva = 'conducta'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border',
                vistaActiva === 'conducta'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400',
              ]"
            >
              <i class="pi pi-users"></i> Conducta
            </button>
          </div>

          <!-- Lado Derecho: Selector de Estudiante + Trimestre -->
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <!-- Selector de Estudiante -->
            <div class="relative w-full sm:w-80">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                <i class="pi pi-user text-sm"></i>
              </div>
              <select
                v-model="hijoSeleccionadoId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer appearance-none transition"
              >
                <option v-for="hijo in hijos" :key="hijo.id" :value="hijo.id">
                  {{ hijo.nombre }} ({{ hijo.grado }})
                </option>
              </select>
              <i
                class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"
              ></i>
            </div>

            <!-- Selector de Trimestre -->
            <select
              v-model="selectedTrimestre"
              class="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm cursor-pointer text-sm"
            >
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
            </select>
          </div>
        </div>

        <!-- TABLA 1: CALIFICACIONES -->
        <div v-if="vistaActiva === 'calificaciones'" class="animate-fade-in mb-8">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i class="pi pi-chart-bar text-blue-600"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Calificaciones por Asignatura</h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Asignatura</th>
                    <th class="px-6 py-4 text-center">Nota 30%</th>
                    <th class="px-6 py-4 text-center">Nota 40%</th>
                    <th class="px-6 py-4 text-center">Nota 30%</th>
                    <th class="px-6 py-4 text-center">Promedio</th>
                    <th class="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(calificacion, index) in calificaciones"
                    :key="index"
                    class="hover:bg-blue-50/50 transition"
                  >
                    <td class="px-6 py-4">
                      <p class="font-bold text-gray-800">{{ calificacion.asignatura }}</p>
                      <p class="text-xs text-gray-500">{{ calificacion.profesor }}</p>
                    </td>
                    <td class="px-6 py-4 text-center text-gray-600 font-medium">
                      {{ calificacion.nota1 }}
                    </td>
                    <td class="px-6 py-4 text-center text-gray-600 font-medium">
                      {{ calificacion.nota2 }}
                    </td>
                    <td class="px-6 py-4 text-center text-gray-600 font-medium">
                      {{ calificacion.nota3 }}
                    </td>
                    <td class="px-6 py-4 text-center font-bold text-blue-600 text-lg">
                      {{ calificacion.promedio }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                        :class="getNotaEstadoClass(calificacion.estado)"
                      >
                        {{ calificacion.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TABLA 2: CONDUCTA -->
        <div v-if="vistaActiva === 'conducta'" class="animate-fade-in mb-6">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i class="pi pi-star text-blue-600"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Evaluación de Conducta</h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Descripción de Conducta</th>
                    <th class="px-6 py-4 text-center w-48">Calificación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(conducta, index) in conductaGeneral"
                    :key="index"
                    class="hover:bg-blue-50/50 transition"
                  >
                    <td class="px-6 py-5 font-medium text-gray-700">
                      {{ conducta.descripcion }}
                    </td>
                    <td class="px-6 py-5 text-center">
                      <span
                        class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                        :class="getConductaClass(conducta.calificacion)"
                      >
                        {{ conducta.calificacion }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

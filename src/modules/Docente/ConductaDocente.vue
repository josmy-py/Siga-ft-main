<script setup>
import { ref, computed } from "vue";

const selectedTrimestre = ref("1");

const grados = ref(["3° B", "4° A"]);

const selectedGrado = ref("3° B");

const estudiantesPorGrado = ref({
  "3° B": [
    { id: 1, nombre: "Ana Martínez González" },
    { id: 2, nombre: "Carlos López Ramírez" },
    { id: 3, nombre: "María García Hernández" },
  ],
  "4° A": [
    { id: 4, nombre: "Luis Pérez Sánchez" },
    { id: 5, nombre: "Laura Ruiz Martínez" },
  ],
});

const selectedEstudiante = ref(null);

const estudiantes = computed(() => {
  return estudiantesPorGrado.value[selectedGrado.value] || [];
});

const aspectosConducta = ref([
  {
    id: 1,
    nombre: "Participa activamente en las actividades académicas y extracurriculares.",
    valor: 3,
  },
  {
    id: 2,
    nombre: "Demuestra respeto hacia compañeros, docentes y personal de la institución.",
    valor: 3,
  },
  { id: 3, nombre: "Cumple puntualmente con las tareas y responsabilidades asignadas.", valor: 3 },
  {
    id: 4,
    nombre: "Muestra interés por aprender y mejorar continuamente su rendimiento académico.",
    valor: 3,
  },
  {
    id: 5,
    nombre: "Mantiene una actitud positiva frente a los desafíos y dificultades.",
    valor: 3,
  },
  {
    id: 6,
    nombre: "Respeta las normas de convivencia y el reglamento interno de la institución.",
    valor: 3,
  },
]);

const promedioCalculado = computed(() => {
  if (aspectosConducta.value.length === 0) return 0;
  const total = aspectosConducta.value.reduce((sum, a) => sum + a.valor, 0);
  return (total / aspectosConducta.value.length).toFixed(1);
});

const getConductaTexto = (promedio) => {
  const val = parseFloat(promedio);
  if (val >= 3.5) return "Excelente";
  if (val >= 2.5) return "Bueno";
  if (val >= 1.5) return "Malo";
  return "Deficiente";
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Evaluación de Conducta</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Grado </label>

              <select
                v-model="selectedGrado"
                @change="selectedEstudiante = null"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option v-for="grado in grados" :key="grado" :value="grado">
                  {{ grado }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Estudiante </label>

              <select
                v-model="selectedEstudiante"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option :value="null">Seleccionar estudiante</option>

                <option v-for="estudiante in estudiantes" :key="estudiante.id" :value="estudiante">
                  {{ estudiante.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Trimestre </label>

              <select
                v-model="selectedTrimestre"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
              </select>
            </div>
          </div>
          <p class="text-sm text-gray-500">Período 2026</p>
        </section>

        <div v-if="selectedEstudiante" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-md p-6">
            <div class="mb-4">
              <h2 class="text-xl font-semibold text-gray-800">
                Evaluación de Conducta - {{ selectedEstudiante.nombre }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="aspecto in aspectosConducta"
                :key="aspecto.id"
                class="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <span class="font-medium text-gray-700">{{ aspecto.nombre }}</span>
                <select
                  v-model="aspecto.valor"
                  class="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="1">1 - Deficiente</option>
                  <option :value="3">3 - Malo</option>
                  <option :value="4">4 - Bueno</option>
                  <option :value="5">5 - Excelente</option>
                </select>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-600">Promedio: </span>
                <span class="text-2xl font-bold text-blue-600">{{ promedioCalculado }}</span>
                <span
                  class="ml-2 text-sm font-medium"
                  :class="promedioCalculado >= 3 ? 'text-green-600' : 'text-yellow-600'"
                >
                  ({{ getConductaTexto(promedioCalculado) }})
                </span>
              </div>
              <button
                class="px-6 py-2 bg-blue-500 text-white border border-transparent rounded-lg hover:bg-blue-600 transition"
              >
                Guardar Evaluación
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-md p-8 text-center">
          <i class="pi pi-info-circle text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Seleccione un grado y estudiante para evaluar su conducta</p>
        </div>
      </div>
    </main>
  </div>
</template>

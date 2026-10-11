<script setup>
import { ref, computed } from "vue";

const filtroGrado = ref("");
const filtroSeccion = ref("");

const estudiantes = ref([
  {
    id: 1,
    nombre: "Ana Martínez González",
    nie: "12345678",
    grado: "3°",
    seccion: "B",
    email: "ana.martinez@email.com",
  },
  {
    id: 2,
    nombre: "Carlos López Ramírez",
    nie: "87654321",
    grado: "3°",
    seccion: "B",
    email: "carlos.lopez@email.com",
  },
  {
    id: 3,
    nombre: "María García Hernández",
    nie: "11223344",
    grado: "3°",
    seccion: "A",
    email: "maria.garcia@email.com",
  },
  {
    id: 4,
    nombre: "Luis Pérez Sánchez",
    nie: "55667788",
    grado: "4°",
    seccion: "A",
    email: "luis.perez@email.com",
  },
]);

const estudiantesFiltrados = computed(() => {
  return estudiantes.value.filter((estudiante) => {
    const coincideGrado = !filtroGrado.value || estudiante.grado === filtroGrado.value;

    const coincideSeccion = !filtroSeccion.value || estudiante.seccion === filtroSeccion.value;

    return coincideGrado && coincideSeccion;
  });
});

// MODAL
const showModal = ref(false);
const selectedStudent = ref(null);

const verEstudiante = (estudiante) => {
  selectedStudent.value = estudiante;
  showModal.value = true;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Mis Estudiantes</h1>
          </div>
        </div>
      </header>

      <div class="flex flex-wrap items-end gap-4 p-4 mt-8">
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Grado</label>
          <select v-model="filtroGrado" class="px-4 py-2 border rounded-lg">
            <option value="">Todos</option>
            <option value="3°">3°</option>
            <option value="4°">4°</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Sección</label>
          <select v-model="filtroSeccion" class="px-4 py-2 border rounded-lg">
            <option value="">Todas</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
      </div>

      <!-- TABLA -->
      <div class="p-6">
        <div class="overflow-x-auto bg-white rounded-2xl border shadow-sm">
          <table class="min-w-full">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-5 py-3 text-left">Nombre</th>
                <th class="px-5 py-3 text-center">NIE</th>
                <th class="px-5 py-3 text-center">Grado</th>
                <th class="px-5 py-3 text-center">Email</th>
                <th class="px-5 py-3 text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="estudiante in estudiantesFiltrados"
                :key="estudiante.id"
                class="border-t hover:bg-blue-50"
              >
                <td class="px-5 py-4 font-semibold">
                  {{ estudiante.nombre }}
                </td>

                <td class="px-5 py-4 text-center">
                  {{ estudiante.nie }}
                </td>

                <td class="px-5 py-4 text-center">
                  {{ estudiante.grado }} {{ estudiante.seccion }}
                </td>

                <td class="px-5 py-4 text-center">
                  {{ estudiante.email }}
                </td>

                <td class="px-5 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="verEstudiante(estudiante)"
                      class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-600 hover:text-white transition"
                    >
                      <i class="pi pi-eye"></i>
                      Ver
                    </button>

                    <router-link
                      to="/docente/notas"
                      class="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      Calificar
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

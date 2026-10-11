<script setup>
import { ref } from "vue";

// --- DATOS DE LOS ESTUDIANTES ---
const hijos = ref([
  {
    id: 1,
    nombre: "Juan Pérez",
    grado: "5° Primaria",
    seccion: "A",
  },
  {
    id: 2,
    nombre: "María Ruiz",
    grado: "3° Primaria",
    seccion: "B",
  },
]);

const hijoSeleccionadoId = ref(hijos.value[0].id);

// --- ASIGNATURAS POR ESTUDIANTE (Ejemplo dinámico o estático) ---
const asignaturas = ref([
  {
    id: 1,
    nombre: "Matemáticas",
    tipo: "Asignatura",
    profesor: "Ing. María González",
    icono: "pi pi-calculator",
    colorBarra: "bg-blue-600",
    bgIcon: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    nombre: "Lenguaje y Literatura",
    tipo: "Asignatura",
    profesor: "Ing. María González",
    icono: "pi pi-file",
    colorBarra: "bg-amber-500",
    bgIcon: "bg-amber-50 text-amber-600",
  },
  {
    id: 3,
    nombre: "Ciencias Naturales",
    tipo: "Asignatura",
    profesor: "Ing. María González",
    icono: "pi pi-lightbulb",
    colorBarra: "bg-emerald-500",
    bgIcon: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 4,
    nombre: "Estudios Sociales",
    tipo: "Asignatura",
    profesor: "Ing. María González",
    icono: "pi pi-globe",
    colorBarra: "bg-blue-500",
    bgIcon: "bg-blue-50 text-blue-500",
  },
  {
    id: 5,
    nombre: "Educación Física",
    tipo: "Asignatura",
    profesor: "Prof. Laura Sánchez",
    icono: "pi pi-heart",
    colorBarra: "bg-rose-500",
    bgIcon: "bg-rose-50 text-rose-500",
  },
  {
    id: 6,
    nombre: "Inglés",
    tipo: "Asignatura",
    profesor: "Lic. Patricia Ruiz",
    icono: "pi pi-comments",
    colorBarra: "bg-purple-500",
    bgIcon: "bg-purple-50 text-purple-600",
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Mis Asignaturas</h1>
          </div>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1">
        <!-- BARRA SUPERIOR: SELECTOR DE ESTUDIANTE ANCHO Y CÓMODO -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"
            >
              <i class="pi pi-users text-lg"></i>
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-800">Seleccionar Estudiante</h2>
            </div>
          </div>

          <!-- Selector Grande y Estilizado -->
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
        </div>

        <!-- TARJETAS DE ASIGNATURAS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="asignatura in asignaturas"
            :key="asignatura.id"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
          >
            <!-- Cuerpo de la tarjeta -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg',
                    asignatura.bgIcon,
                  ]"
                >
                  <i :class="asignatura.icono"></i>
                </div>
                <span
                  class="text-[11px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg"
                >
                  {{ asignatura.tipo }}
                </span>
              </div>

              <h3 class="text-lg font-bold text-gray-800 mb-1">{{ asignatura.nombre }}</h3>
              <p class="text-xs text-gray-400 flex items-center gap-1.5 mt-3">
                <i class="pi pi-user text-gray-400 text-[11px]"></i>
                {{ asignatura.profesor }}
              </p>
            </div>

            <!-- Línea de color inferior decorativa -->
            <div :class="['h-1.5 w-full', asignatura.colorBarra]"></div>
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

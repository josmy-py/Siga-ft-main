<script setup>
import { ref } from "vue";

const asignaturas = ref([
  {
    id: 1,
    nombre: "Matemáticas",
    grado: "3°",
    seccion: "B",
    color: "blue",
    icono: "pi-calculator",
    estudiantes: 25,
  },
  {
    id: 2,
    nombre: "Ciencias Naturales",
    grado: "3°",
    seccion: "B",
    color: "green",
    icono: "pi-lightbulb",
    estudiantes: 25,
  },
  {
    id: 3,
    nombre: "Lenguaje y Literatura",
    grado: "3°",
    seccion: "A y B",
    color: "amber",
    icono: "pi-book",
    estudiantes: 26,
  },
  {
    id: 4,
    nombre: "Estudios Sociales",
    grado: "3°",
    seccion: "B",
    color: "blue",
    icono: "pi-globe",
    estudiantes: 26,
  },
]);

const getColorClasses = (color) => {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", from: "from-blue-400", to: "to-blue-600" },
    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
      from: "from-violet-400",
      to: "to-violet-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      from: "from-amber-400",
      to: "to-amber-600",
    },
    red: { bg: "bg-red-100", text: "text-red-600", from: "from-red-400", to: "to-red-600" },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      from: "from-green-400",
      to: "to-green-600",
    },
  };
  return colors[color] || colors.blue;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Mis Asignaturas</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">
            Asignaturas Asignadas - Período 2026
          </h2>
          <p class="text-sm text-gray-500">Total: {{ asignaturas.length }} asignaturas</p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div
            v-for="asignatura in asignaturas"
            :key="asignatura.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      getColorClasses(asignatura.color).bg,
                      getColorClasses(asignatura.color).text,
                    ]"
                  >
                    <i :class="['pi', asignatura.icono, 'text-xl']"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 text-lg">{{ asignatura.nombre }}</h3>
                    <p class="text-sm text-gray-500">Asignatura</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-users text-gray-400 text-sm"></i>
                  <span class="text-sm text-gray-700"
                    >{{ asignatura.estudiantes }} estudiantes</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-ticket text-gray-400 text-sm"></i>
                  <span class="text-sm text-gray-700"
                    >{{ asignatura.grado }} - Sección {{ asignatura.seccion }}</span
                  >
                </div>
              </div>
            </div>
            <div
              :class="[
                'h-1 w-full bg-gradient-to-r',
                getColorClasses(asignatura.color).from,
                getColorClasses(asignatura.color).to,
              ]"
            ></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

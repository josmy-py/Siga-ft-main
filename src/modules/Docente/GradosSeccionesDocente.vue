<script setup>
import { ref } from "vue";

const gradosSecciones = ref([
  {
    id: 1,
    grado: "3°",
    seccion: "B",
    estudiantes: 25,
    asignaturas: 3,
    docente: "Ing. María González",
  },
  {
    id: 2,
    grado: "3°",
    seccion: "A",
    estudiantes: 26,
    asignaturas: 2,
    docente: "Ing. María González",
  },
]);
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Grados y Secciones</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Grados y Secciones Asignados</h2>
          <p class="text-sm text-gray-500">Información de grados a cargo del docente</p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="item in gradosSecciones"
            :key="item.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-book text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-800 text-lg">
                  {{ item.grado }} - Sección {{ item.seccion }}
                </h3>
                <p class="text-sm text-gray-500">Grado Escolar</p>
              </div>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Estudiantes:</span>
                <span class="font-medium text-gray-800">{{ item.estudiantes }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Asignaturas:</span>
                <span class="font-medium text-gray-800">{{ item.asignaturas }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Docente:</span>
                <span class="font-medium text-gray-800">{{ item.docente }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

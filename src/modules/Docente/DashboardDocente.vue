<script setup>
import { ref } from "vue";

const teacherName = ref("Ing. María González");
const hasNewNotices = ref(true);
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Portal del Profesor</h1>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative">
              <button
                class="p-2 border border-transparent bg-transparent rounded-lg hover:bg-gray-100 transition text-gray-600"
              >
                <i class="pi pi-bell text-xl"></i>

                <span
                  v-if="hasNewNotices"
                  class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"
                ></span>
              </button>
            </div>

            <div class="flex items-center gap-3 pl-4 border-l border-gray-200"></div>
          </div>
        </div>
      </header>

      <div class="p-4 lg:p-6 space-y-4">
        <section class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-800">Bienvenido, {{ teacherName }}</h3>

            <p class="text-sm text-gray-500">Profesor del Complejo Educativo Hacienda Colima</p>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-gray-700 mb-4">Accesos Rápidos</h2>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <router-link
              to="/docente/notas"
              class="bg-white text-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-file-edit text-blue-600 text-xl"></i>
                </div>

                <div>
                  <h3 class="font-bold text-gray-800">Registro de Notas</h3>
                </div>
              </div>
            </router-link>

            <router-link
              to="/docente/asignaturas"
              class="bg-white text-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-check-circle text-violet-600 text-xl"></i>
                </div>

                <div>
                  <h3 class="font-bold text-gray-800">Mis Asignaturas</h3>
                </div>
              </div>
            </router-link>

            <router-link
              to="/docente/estudiantes"
              class="bg-white text-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-users text-emerald-600 text-xl"></i>
                </div>

                <div>
                  <h3 class="font-bold text-gray-800">Mis Estudiantes</h3>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Mis Materias, Grados y Secciones</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 text-gray-500 text-sm">
                <th class="text-left py-4 px-3 font-semibold">Materia</th>

                <th class="text-left py-4 px-3 font-semibold">Grado</th>

                <th class="text-left py-4 px-3 font-semibold">Sección</th>

                <th class="text-left py-4 px-3 font-semibold">Estudiantes</th>

                <th class="text-left py-4 px-3 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr class="hover:bg-gray-50 transition">
                <td class="py-5 px-3">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <i class="pi pi-calculator text-blue-600 text-xl"></i>
                    </div>

                    <span class="font-medium text-gray-700"> Matemáticas </span>
                  </div>
                </td>

                <td class="py-5 px-3 text-gray-600 font-medium">9° Grado</td>

                <td class="py-5 px-3 text-gray-600 font-medium">A</td>

                <td class="py-5 px-3 text-gray-600 font-medium">28</td>

                <td class="py-5 px-3">
                  <button
                    class="px-5 py-2 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition"
                  >
                    Ver estudiantes
                  </button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition">
                <td class="py-5 px-3">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <i class="pi pi-book text-blue-600 text-xl"></i>
                    </div>

                    <span class="font-medium text-gray-700"> Ciencias Naturales </span>
                  </div>
                </td>

                <td class="py-5 px-3 text-gray-600 font-medium">9° Grado</td>

                <td class="py-5 px-3 text-gray-600 font-medium">B</td>

                <td class="py-5 px-3 text-gray-600 font-medium">27</td>

                <td class="py-5 px-3">
                  <button
                    class="px-5 py-2 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition"
                  >
                    Ver estudiantes
                  </button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition">
                <td class="py-5 px-3">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <i class="pi pi-chart-line text-blue-600 text-xl"></i>
                    </div>

                    <span class="font-medium text-gray-700"> Lenguaje </span>
                  </div>
                </td>

                <td class="py-5 px-3 text-gray-600 font-medium">8° Grado</td>

                <td class="py-5 px-3 text-gray-600 font-medium">A</td>

                <td class="py-5 px-3 text-gray-600 font-medium">16</td>

                <td class="py-5 px-3">
                  <button
                    class="px-5 py-2 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition"
                  >
                    Ver estudiantes
                  </button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition">
                <td class="py-5 px-3">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <i class="pi pi-pencil text-blue-600 text-xl"></i>
                    </div>

                    <span class="font-medium text-gray-700"> Estudios Sociales </span>
                  </div>
                </td>

                <td class="py-5 px-3 text-gray-600 font-medium">7° Grado</td>

                <td class="py-5 px-3 text-gray-600 font-medium">A</td>

                <td class="py-5 px-3 text-gray-600 font-medium">15</td>

                <td class="py-5 px-3">
                  <button
                    class="px-5 py-2 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition"
                  >
                    Ver estudiantes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-center mt-8"></div>
      </div>
    </main>
  </div>
</template>

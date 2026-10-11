<script setup>
import { ref } from "vue";

const Materias = ref([
  { nombre: "Matemáticas" },
  { nombre: "Ciencias" },
  { nombre: "Historia" },
  { nombre: "Lenguaje" },
  { nombre: "Arte" }
]);
</script>

<template>
  <div class="w-full p-4 md:p-6">

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            Materias Registradas
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            Gestiona las materias del sistema académico.
          </p>
        </div>

      </div>

      <div class="p-5">

        <div class="flex justify-end">
          <div class="relative w-full md:w-80">

            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              type="text"
              placeholder="Buscar materia..."
              class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

          </div>
        </div>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">

        <table class="w-full">

          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nombre
              </th>

              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="(materia, index) in Materias"
              :key="index"
              class="border-t hover:bg-slate-50 transition"
            >

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">

                  <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <i class="pi pi-book text-emerald-600"></i>
                  </div>

                  <span class="font-medium text-gray-700">
                    {{ materia.nombre }}
                  </span>

                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-center gap-3">

                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                  >
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>

                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                  >
                    <i class="pi pi-trash"></i>
                    Eliminar
                  </button>

                </div>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <div class="p-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <span class="text-sm text-gray-500">
          Total de materias:
          <strong class="text-gray-800">{{ Materias.length }}</strong>
        </span>

        <span class="text-sm text-emerald-600 font-medium">
          Catálogo Académico
        </span>

      </div>

    </div>

  </div>
</template>

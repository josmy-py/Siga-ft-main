<script setup>
import { ref } from "vue";

const Especialidades = ref([
  { nombre: "Primera Infancia" },
  { nombre: "Educación Parvularia" },
  { nombre: "Educación Básica" },
  { nombre: "Educación Media" }
]);
</script>

<template>
  <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          Especialidades Registradas
        </h2>

        <p class="text-gray-500 text-sm mt-1">
          Gestiona las especialidades disponibles en el sistema.
        </p>
      </div>



    </div>

    <div class="mb-6">
      <div class="relative max-w-md">

        <i
          class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>

        <input
          type="text"
          placeholder="Buscar especialidad..."
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-hidden rounded-2xl border border-gray-100">

      <table class="w-full">

        <thead class="bg-slate-50">

          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Especialidad
            </th>

            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              Acciones
            </th>
          </tr>

        </thead>

        <tbody>

          <tr
            v-for="(especialidad, index) in Especialidades"
            :key="index"
            class="border-t hover:bg-slate-50 transition"
          >

            <td class="px-6 py-4">

              <div class="flex items-center gap-3">

                <div
                  class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"
                >
                  <i class="pi pi-star text-blue-600"></i>
                </div>

                <span class="font-medium text-gray-700">
                  {{ especialidad.nombre }}
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

    <div class="flex justify-between items-center mt-5">

      <span class="text-sm text-gray-500">
        Total de especialidades:
        <strong>{{ Especialidades.length }}</strong>
      </span>

      <span class="text-sm text-blue-600 font-medium">
        Catálogo Académico
      </span>

    </div>

  </div>
</template>

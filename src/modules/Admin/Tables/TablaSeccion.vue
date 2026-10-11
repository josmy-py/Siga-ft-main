<script setup>
import { ref } from "vue";

const secciones = ref([
  { nombre: "A", capacidad: 30, turno: "Mañana", docente: "Juan Pérez", grado: "3°", anio: "2024" },
  { nombre: "B", capacidad: 25, turno: "Tarde", docente: "María Gómez", grado: "4°", anio: "2024" },
  {
    nombre: "C",
    capacidad: 20,
    turno: "Mañana",
    docente: "Carlos López",
    grado: "5°",
    anio: "2024",
  },
]);
</script>

<template>
  <div class="w-full">
<div class="bg-white rounded-3xl shadow-sm border border-gray-100">      <!-- HEADER -->
      <div
        class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Secciones Registradas</h2>
          <p class="text-gray-500 text-sm mt-1">Gestión de secciones académicas del sistema.</p>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="p-5">
        <div class="flex justify-end">
          <div class="relative w-full md:w-80">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              type="text"
              placeholder="Buscar sección..."
              class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>
      </div>

<div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
  <table class="min-w-[1200px] text-sm">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Nombre
        </th>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Capacidad
        </th>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Turno
        </th>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Docente
        </th>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Grado
        </th>
        <th class="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
          Año
        </th>
        <th class="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-100">
      <tr
        v-for="(seccion, index) in secciones"
        :key="index"
        class="hover:bg-gray-50 transition"
      >
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <i class="pi pi-tag text-indigo-600"></i>
            </div>
            <span class="font-medium text-gray-800">
              {{ seccion.nombre }}
            </span>
          </div>
        </td>

        <td class="px-6 py-4 text-gray-700">
          {{ seccion.capacidad }}
        </td>

        <td class="px-6 py-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {{ seccion.turno }}
          </span>
        </td>

        <td class="px-6 py-4 text-gray-700">
          {{ seccion.docente }}
        </td>

        <td class="px-6 py-4 text-gray-700">
          {{ seccion.grado }}
        </td>

        <td class="px-6 py-4 text-gray-700">
          {{ seccion.anio }}
        </td>

        <td class="px-6 py-4">
          <div class="flex justify-center gap-2">
            <button class="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition">
              <i class="pi pi-pencil"></i>
              Editar
            </button>

            <button class="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition">
              <i class="pi pi-trash"></i>
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


      <!-- FOOTER -->
      <div
        class="p-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <span class="text-sm text-gray-500">
          Total de secciones:
          <strong class="text-gray-800">{{ secciones.length }}</strong>
        </span>

        <span class="text-sm text-indigo-600 font-medium"> Catálogo Académico </span>
      </div>
    </div>
  </div>
</template>

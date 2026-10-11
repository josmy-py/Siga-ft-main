<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["ver-detalle"]);

const props = defineProps({
  estado: {
    type: String,
    default: "pendiente"
  }
});

const search = ref("");

const filtros = ref({
  ingreso: "",
  anio: ""
});


// DATOS SIMULADOS DE MATRÍCULA
const matriculas = ref([
  {
    fecha: "2026-06-07",
    nombre: "Juan Pérez",
    ingreso: "Nuevo",
    especialidad: "Educación Básica",
    estado: "pendiente"
  },
  {
    fecha: "2026-06-06",
    nombre: "María López",
    ingreso: "Reingreso",
    especialidad: "Parvularia",
    estado: "pendiente"
  },
  {
    fecha: "2026-06-05",
    nombre: "Carlos Ruiz",
    ingreso: "Nuevo",
    especialidad: "Parvularia",
    estado: "aprobada"
  },
  {
    fecha: "2026-06-04",
    nombre: "Ana Martínez",
    ingreso: "Reingreso",
    especialidad: "Educacion Basica",
    estado: "rechazada"
  }
]);

const matriculasFiltradas = computed(() => {
  return matriculas.value.filter(
    item => item.estado === props.estado
  );
});


const abrirFormulario = () => {
  emit("ver-detalle");
};


</script>

<template>
  <div class="p-5">

    <div class="flex flex-wrap items-end gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar matrícula..."
          class="p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Ingreso
        </label>

        <select
          v-model="filtros.ingreso"
          class="p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="">Seleccione</option>
          <option value="Nuevo">Nuevo Ingreso</option>
          <option value="Antiguo">Antiguo Ingreso</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Año
        </label>

        <select
          v-model="filtros.anio"
          class="p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="">Seleccione</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <button
        class="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
        @click="filtros = { ingreso: '', anio: '' }; search = ''"
      >
        <i class="pi pi-filter-slash mr-2"></i>
        Limpiar Filtros
      </button>

    </div>

    <div class="overflow-x-auto mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">

      <table class="min-w-full">

        <thead class="bg-gradient-to-r from-slate-50 to-slate-100">
          <tr>

            <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Fecha
            </th>

            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Nombre
            </th>

            <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Ingreso
            </th>

            <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Especialidad
            </th>

            <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Estado
            </th>

            <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          <tr
            v-for="(item, index) in matriculasFiltradas"
            :key="index"
            class="border-t border-gray-100 hover:bg-blue-50 transition-all duration-200"
          >

            <td class="px-6 py-5 text-center text-gray-600 font-medium">
              {{ item.fecha }}
            </td>

            <td class="px-6 py-5">
              <div class="flex items-center gap-3">

                <div
                  class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                >
                  <i class="pi pi-user text-blue-600"></i>
                </div>

                <span class="font-semibold text-gray-800">
                  {{ item.nombre }}
                </span>

              </div>
            </td>

            <td class="px-6 py-5 text-center">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
              >
                {{ item.ingreso }}
              </span>
            </td>

            <td class="px-6 py-5 text-center font-medium text-gray-700">
              {{ item.especialidad }}
            </td>

            <td class="px-6 py-5 text-center">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
              >
                {{ item.estado }}
              </span>
            </td>

            <td class="px-6 py-5 text-center">

              <div class="flex justify-center">

            <button
              v-if="estado === 'pendiente'"
              @click="abrirFormulario"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Ver detalles
            </button>

            <button
              v-else
              @click="abrirModal(item)"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Ver información
            </button>

              </div>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <div
      class="mt-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >

      <span class="text-sm text-gray-500">
        Total de matrículas:
        <strong class="text-indigo-600 text-base">
          {{ matriculasFiltradas.length }}
        </strong>
      </span>

      <span class="text-sm font-medium text-indigo-600">
        Catálogo Académico
      </span>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  estado: {
    type: String,
    required: true
  }
});

// DATOS SIMULADOS
const reportes = ref([
  {
    fecha: "2026-06-07",
    nombre: "Juan Pérez",
    ingreso: "Nuevo",
    especialidad: "Educacion Basica",
    estado: "pendiente"
  },
  {
    fecha: "2026-06-05",
    nombre: "Carlos Ruiz",
    ingreso: "Nuevo",
    especialidad: "Parvularia",
    estado: "atendido"
  },
  {
    fecha: "2026-06-04",
    nombre: "Ana Martínez",
    ingreso: "Reingreso",
    especialidad: "Educacion Basica",
    estado: "recibido"
  }
]);

// FILTRADO POR ESTADO (lo importante)
const reportesFiltrados = computed(() => {
  return reportes.value.filter(
    r => r.estado === props.estado
  );
});
</script>

<template>
  <div>

    <h2 class="text-lg font-semibold mb-4 text-gray-700">
      Estado:
      <span class="text-indigo-600 capitalize">
        {{ estado }}
      </span>
    </h2>

    <div class="overflow-x-auto bg-white rounded-2xl border border-gray-200">

      <table class="min-w-full">

        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600">Fecha</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600">Nombre</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600">Ingreso</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600">Especialidad</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600">Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in reportesFiltrados"
            :key="index"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-center">{{ item.fecha }}</td>
            <td class="px-6 py-4 font-medium">{{ item.nombre }}</td>
            <td class="px-6 py-4 text-center">{{ item.ingreso }}</td>
            <td class="px-6 py-4 text-center">{{ item.especialidad }}</td>
            <td class="px-6 py-4 text-center capitalize">
              {{ item.estado }}
            </td>
          </tr>
        </tbody>

      </table>

    </div>

  </div>
</template>

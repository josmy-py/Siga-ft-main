<script setup>
import { ref } from "vue";
import reportBoleta from "@/modules/Docente/reportes/Boleta.vue";
import reportConducta from "@/modules/Docente/reportes/Conducta.vue";

// Diagrama: SIGA Docente > Libreta > Reporte de notas y Reporte de conducta
const reporteSeleccionado = ref(null);

const reportes = [
  { id: "notas", nombre: "Reporte de notas", icono: "pi-file", color: "text-blue-600" },
  { id: "conducta", nombre: "Reporte de conducta", icono: "pi-star", color: "text-amber-600" },
];

const cerrarFormulario = () => {
  reporteSeleccionado.value = null;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-800">Libreta</h1>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <div v-if="!reporteSeleccionado" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            v-for="reporte in reportes"
            :key="reporte.id"
            @click="reporteSeleccionado = reporte.id"
            class="text-left bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
          >
            <i :class="['pi', reporte.icono, reporte.color, 'text-2xl']"></i>
            <h2 class="mt-3 font-bold text-gray-800">{{ reporte.nombre }}</h2>
          </button>
        </div>

        <div v-else>
          <reportBoleta v-if="reporteSeleccionado === 'notas'" @cerrar="cerrarFormulario" />
          <reportConducta v-if="reporteSeleccionado === 'conducta'" @cerrar="cerrarFormulario" />
        </div>
      </div>
    </main>
  </div>
</template>

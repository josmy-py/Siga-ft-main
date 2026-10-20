<script setup>
import Swal from "sweetalert2";

// Vista de tarjetas de Reportes, igual para el portal docente y el del director.
// Cada reporte: { id, titulo, descripcion, icono, fondo, color, disponible }.
// Si el reporte aún no tiene formulario definido (disponible: false), el botón
// solo avisa; no genera nada.
defineProps({
  reportes: { type: Array, required: true },
});
const emit = defineEmits(["generar"]);

const generar = (reporte) => {
  if (reporte.disponible) {
    emit("generar", reporte.id);
    return;
  }
  Swal.fire({
    icon: "info",
    title: reporte.titulo,
    text: "El formulario de este reporte aún no está definido.",
  });
};
</script>

<template>
  <div class="p-6 lg:p-8">
    <h1 class="text-xl font-semibold text-gray-800">Reportes</h1>
    <p class="mt-2 mb-6 text-sm text-gray-500">Genera y descarga reportes académicos</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div
        v-for="reporte in reportes"
        :key="reporte.id"
        class="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div class="flex items-center gap-4">
          <div :class="['w-11 h-11 shrink-0 rounded-lg flex items-center justify-center', reporte.fondo]">
            <i :class="['pi', reporte.icono, reporte.color, 'text-lg']"></i>
          </div>
          <h2 class="text-lg font-bold text-gray-800 leading-snug">{{ reporte.titulo }}</h2>
        </div>

        <p class="mt-6 mb-4 text-sm text-gray-600 flex-1">{{ reporte.descripcion }}</p>

        <button
          class="w-full py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          @click="generar(reporte)"
        >
          Generar Reporte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Academico from "@/modules/Admin/Forms/reports/Academico.vue";
import Conducta from "@/modules/Admin/Forms/reports/Conducta.vue";

// Diagrama: Administración académica > Generar reportes académicos (notas y conducta)
const formularioActivo = ref(null);

const cerrarFormulario = () => {
  formularioActivo.value = null;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-800">Reportes académicos</h1>
        </div>
      </header>

      <div v-if="!formularioActivo" class="p-4 lg:p-6">
        <div class="grid gap-4 md:grid-cols-2">
          <button
            @click="formularioActivo = 'academico'"
            class="text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-500"
          >
            <i class="pi pi-file-edit text-violet-600 text-2xl"></i>
            <h2 class="mt-3 text-lg font-semibold text-gray-800">Reporte de notas</h2>
          </button>

          <button
            @click="formularioActivo = 'conducta'"
            class="text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-500"
          >
            <i class="pi pi-star text-blue-600 text-2xl"></i>
            <h2 class="mt-3 text-lg font-semibold text-gray-800">Reporte de conducta</h2>
          </button>
        </div>
      </div>

      <div v-else>
        <Academico v-if="formularioActivo === 'academico'" @cerrar="cerrarFormulario" />
        <Conducta v-else-if="formularioActivo === 'conducta'" @cerrar="cerrarFormulario" />
      </div>
    </main>
  </div>
</template>

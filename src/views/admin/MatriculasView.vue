<script setup>
import { ref } from "vue";
import MatriculaTable from "@/modules/Admin/Tables/PendienteMatricula.vue";
import FormularioMatricula from "@/modules/Admin/Forms/Matricula.vue";

const estadoActivo = ref("pendiente");

const vistaActual = ref("tabla");

const matriculaSeleccionada = ref(null);

const abrirDetalle = (matricula) => {
  matriculaSeleccionada.value = matricula;
  vistaActual.value = "detalle";
};

const volverTabla = () => {
  vistaActual.value = "tabla";
  matriculaSeleccionada.value = null;
};

const aprobarMatricula = (datos) => {
  console.log("Aprobada", datos);

  vistaActual.value = "tabla";
};

const rechazarMatricula = (datos) => {
  console.log("Rechazada", datos);

  vistaActual.value = "tabla";
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Matrículas</h1>
          </div>
        </div>
      </header>

      <template v-if="vistaActual === 'tabla'">
        <div class="grid grid-cols-3 gap-4 p-8">
          <button
            @click="estadoActivo = 'pendiente'"
            class="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-xl hover:shadow-md transition-all"
            :class="estadoActivo === 'pendiente' ? 'ring-2 ring-blue-400' : ''"
          >
            <span class="font-medium text-blue-600">Pendientes</span>
            <span class="bg-blue-100 px-2 py-1 rounded-full text-sm text-blue-600">2</span>
          </button>

          <button
            @click="estadoActivo = 'aprobada'"
            class="flex items-center justify-between p-4 bg-white border border-green-200 rounded-xl hover:shadow-md transition-all"
            :class="estadoActivo === 'aprobada' ? 'ring-2 ring-green-400' : ''"
          >
            <span class="font-medium text-green-600">Aprobadas</span>
            <span class="bg-green-100 px-2 py-1 rounded-full text-sm text-green-600">1</span>
          </button>

          <button
            @click="estadoActivo = 'rechazada'"
            class="flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl hover:shadow-md transition-all"
            :class="estadoActivo === 'rechazada' ? 'ring-2 ring-red-400' : ''"
          >
            <span class="font-medium text-red-600">Rechazadas</span>
            <span class="bg-red-100 px-2 py-1 rounded-full text-sm text-red-600">1</span>
          </button>
        </div>

        <MatriculaTable :estado="estadoActivo" @ver-detalle="abrirDetalle" />
      </template>

      <template v-else>
        <FormularioMatricula
          :matricula="matriculaSeleccionada"
          @cerrar="volverTabla"
          @aprobar="aprobarMatricula"
          @rechazar="rechazarMatricula"
        />
      </template>
    </main>
  </div>
</template>

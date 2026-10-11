<script setup>
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";
import FichaEncargadoNuevo from "./FormularioEncargado.vue";

const matriculaStore = useMatriculaStore();
const {
  esNuevoIngreso,
  encargadoSeleccionado,
  encargadoManual,
  encargadosDisponibles,
} = storeToRefs(matriculaStore);
</script>

<template>
  <div class="animate-fade-in max-w-3xl mx-auto">
    
    <!-- CASO 1: ES ANTIGUO INGRESO Y NO ESTÁ AGREGANDO UNO MANUALMENTE -->
    <div v-if="!esNuevoIngreso && !encargadoManual" class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-800">
        Seleccionar Responsable
      </h3>
      <p class="text-sm text-gray-500">
        Elige uno de los padres o responsables registrados del estudiante.
      </p>

      <select
        v-if="encargadosDisponibles.length > 0"
        :value="encargadoSeleccionado ? encargadoSeleccionado.id : null"
        @change="
          matriculaStore.seleccionarEncargado(
            encargadosDisponibles.find(
              (e) => e.id === parseInt($event.target.value)
            )
          )
        "
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option :value="null">Seleccionar responsable</option>
        <option
          v-for="enc in encargadosDisponibles"
          :key="enc.id"
          :value="enc.id"
        >
          {{ enc.nombre }} ({{ enc.rol }})
        </option>
      </select>

      <div
        v-if="encargadoSeleccionado"
        class="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
      >
        <p class="font-medium text-gray-800">{{ encargadoSeleccionado.nombre }}</p>
        <p class="text-sm text-gray-500">DUI: {{ encargadoSeleccionado.dui }}</p>
        <p class="text-sm text-gray-500">Teléfono: {{ encargadoSeleccionado.telefono }}</p>
        <p class="text-sm text-gray-500">Rol: {{ encargadoSeleccionado.rol }}</p>
      </div>

      <div
        v-else-if="encargadosDisponibles.length === 0"
        class="text-center py-8 text-gray-400"
      >
        <i class="pi pi-info-circle text-3xl mb-2"></i>
        <p>No hay responsables registrados para este estudiante.</p>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <button
          @click="matriculaStore.agregarOtroEncargado"
          type="button"
          class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm flex items-center gap-2"
        >
          <i class="pi pi-plus"></i> Agregar otro encargado
        </button>
      </div>
    </div>

    <!-- CASO 2: ES NUEVO INGRESO (Directo al form) o ANTIGUO AGREGANDO MANUALMENTE -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ esNuevoIngreso ? 'Datos del Responsable' : 'Agregar Encargado' }}
        </h3>
        
        <button
          v-if="!esNuevoIngreso"
          @click="encargadoManual = false; matriculaStore.resetFormularioEncargado()"
          type="button"
          class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <i class="pi pi-arrow-left"></i> Volver a responsables
        </button>
      </div>

      <FichaEncargadoNuevo />
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
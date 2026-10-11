<script setup>
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";

const matriculaStore = useMatriculaStore();
const { parentescos, encargadoConfirmado } = storeToRefs(matriculaStore);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Nombre Completo del Responsable
      </label>
      <input
        v-model="matriculaStore.encargado.nombres"
        :disabled="encargadoConfirmado"
        type="text"
        placeholder="Ej. María Elena López"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Parentesco con el Alumno
      </label>
      <select
        v-model="matriculaStore.encargado.parentescoId"
        :disabled="encargadoConfirmado"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">Seleccionar parentesco</option>
        <option v-for="parent in parentescos" :key="parent.id" :value="parent.id">
          {{ parent.nombre }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
      <input
        v-model="matriculaStore.encargado.dui"
        :disabled="encargadoConfirmado"
        type="text"
        placeholder="00000000-0"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>

    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Teléfono de Contacto
      </label>
      <input
        v-model="matriculaStore.encargado.telefono"
        :disabled="encargadoConfirmado"
        type="text"
        placeholder="7000-0000"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>

    <!-- Botonera de Acción -->
    <div class="md:col-span-2 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
      
      <!-- Mensaje de éxito visible solo si está confirmado -->
      <div v-if="encargadoConfirmado" class="flex-1 px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2 w-full">
        <i class="pi pi-check-circle text-xl"></i>
        <span class="text-sm font-medium">Encargado agregado y listo para el registro.</span>
      </div>
      <div v-else class="flex-1"></div>

      <!-- Botones -->
      <button
        v-if="!encargadoConfirmado"
        @click="matriculaStore.confirmarNuevoEncargado()"
        type="button"
        class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <i class="pi pi-check"></i> Agregar Encargado
      </button>

      <button
        v-else
        @click="matriculaStore.encargadoConfirmado = false"
        type="button"
        class="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <i class="pi pi-pencil"></i> Editar Datos
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const emit = defineEmits(["save"]);

// orden: posición del grado en la progresión académica (M2.1). La API lo exige
// al crear o editar y lo usa para calcular el grado siguiente en la promoción.
const Grados = ref({
  nombre: "",
  orden: null
});

const limpiar = () => {
  Grados.value = {
    nombre: "",
    orden: null
  };
};

const guardarGrado = () => {
  if (!Grados.value.nombre || !Grados.value.orden) {
    alert("Por favor completa los campos requeridos");
    return;
  }

  if (!Number.isInteger(Number(Grados.value.orden)) || Number(Grados.value.orden) < 1) {
    alert("El orden académico debe ser un número entero positivo");
    return;
  }

  console.log("Grado registrado:", Grados.value);
  alert("Grado registrado correctamente");

  emit("save", { ...Grados.value, orden: Number(Grados.value.orden) });

  limpiar();
};
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">

        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-graduation-cap text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">
            Nuevo Grado
          </h2>
          <p class="text-blue-100">
            Gestión de grados académicos
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarGrado" class="p-8">

        <div class="space-y-2">

          <label class="text-sm font-medium text-gray-700">
            Nombre del grado
          </label>

          <div class="relative">

            <i class="pi pi-book absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="Grados.nombre"
              type="text"
              placeholder="Ej: A, B, C..."
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
            />

          </div>

          <p class="text-xs text-gray-500">
            Ingresa el nombre del grado académico.
          </p>

        </div>

        <div class="space-y-2 mt-6">

          <label class="text-sm font-medium text-gray-700">
            Orden académico
          </label>

          <div class="relative">

            <i class="pi pi-sort-numeric-up absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="Grados.orden"
              type="number"
              min="1"
              step="1"
              placeholder="Ej: 1 para primer grado, 10 para primer año de bachillerato"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
            />

          </div>

          <p class="text-xs text-gray-500">
            Posición del grado en la progresión. Un estudiante que aprueba pasa al grado con el siguiente orden.
          </p>

        </div>

        <div class="flex justify-end gap-3 mt-8">

          <button
            type="button"
            @click="limpiar"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <i class="pi pi-refresh mr-2"></i>
            Limpiar
          </button>

          <button
            type="submit"
            class="px-6 py-3 rounded-xl bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 shadow-md transition flex items-center gap-2"
          >
            <i class="pi pi-check"></i>
            Guardar Grado
          </button>

        </div>

      </form>

    </div>
  </div>
</template>

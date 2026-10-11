<script setup>
import { ref } from "vue";

const emit = defineEmits(["save"]);

const Materias = ref({
  nombre: ""
});

const limpiar = () => {
  Materias.value = {
    nombre: ""
  };
};

const guardarMateria = () => {
  if (!Materias.value.nombre) {
    alert("Por favor completa los campos requeridos");
    return;
  }

  console.log("Materia registrada:", Materias.value);
  alert("Materia registrada correctamente");

  emit("save", { ...Materias.value });

  Materias.value = {
    nombre: ""
  };
};
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">

        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-book text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">
            Nueva Materia
          </h2>
          <p class="text-blue-100">
            Gestión de materias académicas
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarMateria" class="p-8">

        <div class="space-y-2">

          <label class="text-sm font-medium text-gray-700">
            Nombre de la materia
          </label>

          <div class="relative">

            <i class="pi pi-bookmark absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="Materias.nombre"
              type="text"
              placeholder="Ej: Matemáticas"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
            />

          </div>

          <p class="text-xs text-gray-500">
            Ingresa el nombre de la materia que se impartirá.
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
            Guardar Materia
          </button>

        </div>

      </form>

    </div>
  </div>
</template>

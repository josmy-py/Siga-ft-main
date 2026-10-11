<script setup>
import { ref } from "vue";

const emit = defineEmits(["cerrar"]);

const profesor = ref({
  id_usuario: "",
  codigo: "",
  fecha_nacimiento: "",
  telefono: "",
  direccion: ""
});

const guardarProfesor = () => {
  console.log(profesor.value);

  emit("cerrar");
};

const cerrar = () => {
  emit("cerrar");
};

</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">
          Registrar Profesor
        </h2>

      </div>

      <div class="p-6">
        <form @submit.prevent="guardarProfesor" class="space-y-5">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Usuario
              </label>

              <select
                v-model="profesor.id_usuario"
                class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un usuario</option>
                <option value="1"> Ana Ruiz</option>
                <option value="2">María Gómez</option>
                <option value="3">Carlos López</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Código de Profesor
              </label>

              <input
                v-model="profesor.codigo"
                type="text"
                placeholder="PROF-001"
                class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Fecha de Nacimiento
              </label>

              <input
                v-model="profesor.fecha_nacimiento"
                type="date"
                class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Teléfono
              </label>

              <input
                v-model="profesor.telefono"
                type="tel"
                placeholder="0000-0000"
                class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">
              Dirección
            </label>

            <textarea
              v-model="profesor.direccion"
              rows="4"
              placeholder="Ingrese la dirección del profesor"
              class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="cerrar"
              class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-lg hover:bg-blue-700 transition"
            >
              Guardar Profesor
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

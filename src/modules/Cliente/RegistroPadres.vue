<script setup>
import { ref } from "vue";

// Datos de prueba (Reemplazar con el Store de Pinia cuando lo conectes)
const padres = ref([
  { id: 1, nombre: "Juan Méndez", relacion: "Padre", dui: "12345678-9" },
  { id: 2, nombre: "Ana Méndez", relacion: "Madre", dui: "98765432-1" },
]);

const mostrarModal = ref(false);
const nuevoPadre = ref({ nombre: "", relacion: "Padre", dui: "", telefono: "", correo: "" });

const guardarPadre = () => {
  padres.value.push({
    id: Date.now(),
    ...nuevoPadre.value,
  });
  mostrarModal.value = false;
  nuevoPadre.value = { nombre: "", relacion: "Padre", dui: "", telefono: "", correo: "" };
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Padres / Encargados</h1>
          </div>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1 animate-fade-in">
        <!-- Encabezado de la sección -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Registro de Padres</h2>
            <p class="text-sm text-gray-500 mt-1">
              Administre la información de los padres de familia
            </p>
          </div>
          <button
            @click="mostrarModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <i class="pi pi-user-plus"></i>
            Registrar
          </button>
        </div>

        <!-- Lista de Padres Registrados -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
          <div v-if="padres.length === 0" class="p-8 text-center text-gray-500">
            No hay padres registrados aún.
          </div>

          <div
            v-for="padre in padres"
            :key="padre.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border-b border-gray-50 last:border-0 gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
              >
                <i class="pi pi-user text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800">{{ padre.nombre }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ padre.relacion }} • DUI: {{ padre.dui }}
                </p>
              </div>
            </div>

            <button
              class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm sm:w-auto w-full"
            >
              <i class="pi pi-pencil text-xs"></i> Editar
            </button>
          </div>
        </div>

        <!-- Modal de Registro -->
        <div
          v-if="mostrarModal"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        >
          <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-xl font-bold text-gray-800">Nuevo Registro</h2>
              <button @click="mostrarModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>

            <form @submit.prevent="guardarPadre" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                <select
                  v-model="nuevoPadre.relacion"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  v-model="nuevoPadre.nombre"
                  type="text"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                <input
                  v-model="nuevoPadre.dui"
                  type="text"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    v-model="nuevoPadre.telefono"
                    type="text"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input
                    v-model="nuevoPadre.correo"
                    type="email"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-4 mt-2 border-t">
                <button
                  type="button"
                  @click="mostrarModal = false"
                  class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

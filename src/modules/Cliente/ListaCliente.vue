<script setup>
import { ref } from "vue";
import RegistroCliente from "./RegistroCliente.vue";

const padre = ref({
  nombre: "Elena Ruiz",
  dui: "01234567-8",
  correo: "carlos.mendez@gmail.com",
});

const hijos = ref([
  {
    id: 1,
    nombre: "Juan Méndez",
    estado: "En proceso ",
  },
  {
    id: 2,
    nombre: "Ana Méndez",
    estado: " Matriculado",
  },
]);

const abrirRegistro = ref(false);

const cerrarRegistro = () => {
  abrirRegistro.value = false;
};

const verDetalles = (hijo) => {
  console.log("Ver detalles de:", hijo);
};

const matricular = (hijo) => {
  console.log("Matricular estudiante:", hijo);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">
      <div v-if="!abrirRegistro" class="p-6">
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <h1 class="text-xl font-bold text-gray-800">Registro</h1>
            </div>
          </div>
        </header>

        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Registro</h2>
              <p class="text-gray-500 text-sm mt-1">
                Estudiantes registrados por {{ padre.nombre }}
              </p>
            </div>

            <button
              @click="abrirRegistro = true"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <i class="pi pi-user-plus"></i>
              Registrar
            </button>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              v-for="hijo in hijos"
              :key="hijo.id"
              class="flex items-center justify-between p-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-user text-blue-600 text-lg"></i>
                </div>

                <div>
                  <h3 class="font-semibold text-gray-800">
                    {{ hijo.nombre }}
                  </h3>

                  <p class="text-sm text-gray-500">
                    {{ hijo.estado }}
                  </p>
                </div>
              </div>

              <button
                v-if="hijo.estado.trim().toLowerCase().includes('proceso')"
                @click="matricular(hijo)"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <i class="pi pi-check"></i>
                Matricular
              </button>

              <button
                v-else-if="hijo.estado.trim().toLowerCase().includes('matriculado')"
                @click="verDetalles(hijo)"
                class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <i class="pi pi-eye"></i>
                Ver detalles
              </button>
            </div>

            <div v-if="hijos.length === 0" class="p-10 text-center text-gray-500">
              No hay estudiantes registrados.
            </div>
          </div>
        </div>
      </div>

      <div v-else class="min-h-screen flex items-start justify-center p-6">
        <div class="w-full max-w-4xl">
          <div class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Registro de Estudiante</h2>
                <p class="text-gray-500 text-sm mt-1">
                  Completa el formulario para registrar un estudiante.
                </p>
              </div>
            </div>
            <RegistroCliente @cerrar="cerrarRegistro" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const padre = ref({
  nombre: "Elena Ruiz",
  dui: "01234567-8",
  correo: "carlos.mendez@gmail.com",
});

const hijos = ref([
  {
    id: 1,
    nombre: "Juan Méndez",
    grado: "Sexto Grado",
    seccion: "A",
  },
  {
    id: 2,
    nombre: "Ana Méndez",
    grado: "Tercer Grado",
    seccion: "B",
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Mi Perfil</h1>
          </div>
        </div>
      </header>

      <div class="bg-gray-100 p-6 rounded-2xl">
        <!-- CARD PERFIL -->
        <div class="bg-white rounded-2xl shadow p-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i class="pi pi-user text-blue-600"></i>
                Perfil del Padre
              </h1>

              <p class="text-gray-500 text-sm mt-1">Información del padre o encargado del alumno</p>
            </div>

            <button
              class="bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <i class="pi pi-pencil"></i>
              Editar
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- DATOS PERSONALES -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-700">
              <i class="pi pi-id-card mr-2 text-blue-500"></i>
              Datos personales
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-credit-card text-gray-500"></i>
                <span> <b>DUI:</b> {{ padre.dui }} </span>
              </div>

              <div class="flex items-center gap-2">
                <i class="pi pi-user text-gray-500"></i>
                <span> <b>Nombre:</b> {{ padre.nombre }} </span>
              </div>
            </div>

            <hr class="my-5" />

            <h2 class="text-lg font-semibold mb-4 text-gray-700">
              <i class="pi pi-phone mr-2 text-green-500"></i>
              Contacto
            </h2>

            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-envelope text-gray-500"></i>
                <span>{{ padre.correo }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-700">
              <i class="pi pi-users mr-2 text-purple-500"></i>
              Alumnos registrados
            </h2>

            <div class="space-y-4">
              <div v-for="hijo in hijos" :key="hijo.id" class="border rounded-xl p-4 bg-gray-50">
                <p class="font-semibold text-gray-800">
                  <i class="pi pi-user mr-2"></i>
                  {{ hijo.nombre }}
                </p>

                <p class="text-sm text-gray-600 mt-1">
                  <i class="pi pi-book mr-2"></i>
                  {{ hijo.grado }} - Sección {{ hijo.seccion }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

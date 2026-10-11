<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const clientName = computed(() => authStore.user?.nombre || "Encargado");
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Dashboard del Cliente</h1>
          </div>
        </div>
      </header>

      <div class="p-6 space-y-6">
        <section
          class="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-8"
        >
          <h2 class="text-3xl font-bold mb-2">¡Bienvenido, {{ clientName }}!</h2>

          <p class="text-blue-100">
            Ha iniciado sesión correctamente. Utilice el menú lateral para acceder a las diferentes
            opciones disponibles del sistema.
          </p>
        </section>

        <section class="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-5 flex gap-4">
          <div
            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
          >
            <i class="pi pi-info-circle text-blue-600 text-xl"></i>
          </div>

          <div>
            <h3 class="font-semibold text-gray-800 mb-1">Información</h3>

            <p class="text-gray-600">
              Para comenzar, seleccione una opción del menú lateral. Desde allí podrá acceder a
              todas las funcionalidades disponibles según los permisos de su cuenta.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Constancia from "./Constancia.vue";
import constanciaPDF from "./constanciaPDF.vue";
import egresadoPDF from "./egresadoPDF.vue";

const mostrarConstancia = ref(false);
const mostrarConducta = ref(false);
const mostrarEgresado = ref(false);

const cerrarEgresado = () => {
  mostrarEgresado.value = false;
};

const cerrarConstancia = () => {
  mostrarConstancia.value = false;
};
const cerrarConducta = () => {
  mostrarConducta.value = false;
};
</script>

<template>
  <div class="relative min-h-screen bg-slate-100 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-slate-800">Constancias Académicas</h1>
          </div>
        </div>
      </header>

      <!-- CONTENIDO -->
      <div class="p-6 lg:p-8">
        <!-- BOTÓN CREAR CONSTANCIA -->
        <div v-if="!mostrarConstancia">
          <div class="flex justify-end mb-6">
            <button
              @click="mostrarConstancia = true"
              class="flex items-center border border-blue-600 gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition"
            >
              <i class="pi pi-plus"></i>
              <span>Crear Constancia</span>
            </button>
          </div>

          <!-- HISTORIAL -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">Historial de Reportes</h2>

              <p class="text-sm text-gray-500 mt-1">
                Consulta los reportes generados anteriormente.
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reporte</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="border-t border-gray-100 hover:bg-gray-50">
                    <td class="px-6 py-4">Constancia de Conducta</td>

                    <td class="px-6 py-4">12/06/2026</td>

                    <td class="px-6 py-4">
                      <span
                        class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                      >
                        Generado
                      </span>
                    </td>

                    <td class="px-6 py-4">
                      <div class="flex justify-center gap-2">
                        <button
                          @click="mostrarConducta = true"
                          class="w-9 h-9 border border-blue-600 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        >
                          <i class="pi pi-eye"></i>
                        </button>

                        <button
                          class="w-9 h-9 border border-green-600 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                        >
                          <i class="pi pi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr class="border-t border-gray-100 hover:bg-gray-50">
                    <td class="px-6 py-4">Constancia de Egresado</td>

                    <td class="px-6 py-4">01/06/2026</td>

                    <td class="px-6 py-4">
                      <span
                        class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                      >
                        Generado
                      </span>
                    </td>

                    <td class="px-6 py-4">
                      <div class="flex justify-center gap-2">
                        <button
                          @click="mostrarEgresado = true"
                          class="w-9 h-9 border border-blue-600 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        >
                          <i class="pi pi-eye"></i>
                        </button>

                        <button
                          class="w-9 h-9 border border-600 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                        >
                          <i class="pi pi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Constancia v-else @cerrar="cerrarConstancia" />
      </div>
    </main>
  </div>

  <div v-if="mostrarConducta" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
    <div class="flex justify-center py-10">
      <constanciaPDF @cerrar="cerrarConducta" />
    </div>
  </div>

  <div v-if="mostrarEgresado" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
    <div class="flex justify-center py-10">
      <egresadoPDF @cerrar="cerrarEgresado" />
    </div>
  </div>
</template>

<template>
  <div class="p-6 lg:p-8">

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <!-- ENCABEZADO -->
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800">
          Historial de Reportes
        </h2>

        <p class="text-sm text-gray-500 mt-1">
          Consulta los reportes generados anteriormente.
        </p>
      </div>

      <!-- TABLA -->
      <div class="overflow-x-auto">
        <table class="w-full">

          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Reporte
              </th>

              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Categoría
              </th>

              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Fecha
              </th>

              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Estado
              </th>

              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>

            <!-- BOLETAS -->
            <tr class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-4">
                Reporte Académico
              </td>

              <td class="px-6 py-4">
                Académico
              </td>

              <td class="px-6 py-4">
                12/06/2026
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Generado
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-center gap-2">

                  <button
                    @click="mostrarAcademico = true"
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

            <!-- CONDUCTA -->
            <tr class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-4">
                Reporte de Conducta
              </td>

              <td class="px-6 py-4">
                Conducta
              </td>

              <td class="px-6 py-4">
                10/06/2026
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
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

            <!-- DOCENTE -->
            <tr class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-4">
                Reporte de Docente
              </td>

              <td class="px-6 py-4">
                Docente
              </td>

              <td class="px-6 py-4">
                08/06/2026
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Generado
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-center gap-2">

                  <button
                    @click="mostrarDocente = true"
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

            <!-- INSTITUCIONAL -->
            <tr class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-4">
                Reporte Institucional
              </td>

              <td class="px-6 py-4">
                Institucional
              </td>

              <td class="px-6 py-4">
                01/06/2026
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Generado
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-center gap-2">

                  <button
                    @click="mostrarinstitucional = true"
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

          </tbody>

        </table>
      </div>

    </div>

  </div>

  <div
  v-if="mostrarAcademico"
  class="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
>
  <div class="flex justify-center py-10">
    <academicoPDF
    @cerrar="cerrarAcademico"/>
  </div>
</div>

<div
  v-if="mostrarConducta"
  class="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
>
  <div class="flex justify-center py-10">
    <conductaPDF
    @cerrar="cerrarConducta"/>
  </div>
</div>

<div
  v-if="mostrarDocente"
  class="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
>
  <div class="flex justify-center py-10">
    <docentePDF
    @cerrar="cerrarDocente"/>
  </div>
</div>

<div
  v-if="mostrarinstitucional"
  class="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
>
  <div class="flex justify-center py-10">
    <institucionalPDF
    @cerrar="cerrarIntitucional"/>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';


import academicoPDF from './academicoPDF.vue';
import conductaPDF from './conductaPDF.vue';
import docentePDF from './docentePDF.vue';
import institucionalPDF from './institucionalPDF.vue';

const mostrarAcademico = ref(false)
const mostrarConducta = ref(false)
const mostrarDocente = ref(false)
const mostrarinstitucional = ref(false)

const cerrarAcademico = () => {
  mostrarAcademico.value = null
};

const cerrarConducta = () => {
  mostrarConducta.value = null
};

const cerrarDocente = () => {
  mostrarDocente.value = null
};

const cerrarIntitucional = () => {
  mostrarinstitucional.value = null
};

</script>

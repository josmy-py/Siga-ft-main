<script setup>
import { ref } from "vue";
import reportBoleta from "@/modules/Docente/reportes/Boleta.vue";
import reportConducta from "@/modules/Docente/reportes/Conducta.vue";
import reportDocente from "@/modules/Docente/reportes/Informe.vue";
import boletaPDF from "@/modules/Docente/reportes/boletaPDF.vue";
import conductaPDF from "@/modules/Docente/reportes/conductaPDF.vue";
import informePDF from "@/modules/Docente/reportes/informePDF.vue";
import Rendimiento from "@/modules/Docente/reportes/Rendimiento.vue";
import rendimientoPDF from "@/modules/Docente/reportes/rendimientoPDF.vue";

const mostrarBoleta = ref(false);
const mostrarConducta = ref(false);
const mostrarInforme = ref(false);
const mostrarRendimiento = ref(false);
const tabActiva = ref("generar");
const reporteSeleccionado = ref(null);

const cerrarBoleta = () => {
  mostrarBoleta.value = null;
};

const cerrarRendimiento = () => {
  mostrarRendimiento.value = null;
};

const cerrarConducta = () => {
  mostrarConducta.value = null;
};

const cerrarInforme = () => {
  mostrarInforme.value = null;
};

const abrirFormulario = (id) => {
  reporteSeleccionado.value = id;
};

const cerrarFormulario = () => {
  reporteSeleccionado.value = null;
};

const reportesDisponibles = ref([
  {
    id: 1,
    nombre: "Boletas de Calificaciones",
    descripcion: "Generar boletas de calificaciones por estudiante",
    icono: "pi-file",
    color: "blue",
  },
  {
    id: 2,
    nombre: "Conducta",
    descripcion: "Reporte de evaluación de conducta",
    icono: "pi-star",
    color: "amber",
  },
  {
    id: 3,
    nombre: "Informe Profesor",
    descripcion: "Registro de actividades, observaciones realizadas por el profesor",
    icono: "pi-user",
    color: "violet",
  },
  {
    id: 4,
    nombre: "Reporte de Rendimiento",
    descripcion: "Reporte de estadisticas y promedios academicos",
    icono: "pi-users",
    color: "cyan",
  },
]);
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Reportes</h1>
          </div>
        </div>
      </header>

      <div class="bg-white border-b border-gray-200">
        <div class="flex">
          <button
            @click="tabActiva = 'generar'"
            class="relative bg-transparent border border-transparent flex items-center gap-3 px-8 py-5 font-medium transition-all duration-200"
            :class="tabActiva === 'generar' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
          >
            <i class="pi pi-file"></i>
            <span>Generar Reporte</span>

            <div
              v-if="tabActiva === 'generar'"
              class="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"
            ></div>
          </button>

          <button
            @click="tabActiva = 'historial'"
            class="relative bg-transparent border border-transparent flex items-center gap-3 px-8 py-5 font-medium transition-all duration-200"
            :class="
              tabActiva === 'historial' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            "
          >
            <i class="pi pi-folder"></i>
            <span>Historial de Reportes</span>

            <div
              v-if="tabActiva === 'historial'"
              class="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"
            ></div>
          </button>
        </div>
      </div>

      <!-- GENERAR REPORTES -->
      <!-- GENERAR REPORTES -->
      <div v-if="tabActiva === 'generar'" class="p-6 lg:p-8">
        <!-- LISTA DE REPORTES -->
        <div v-if="!reporteSeleccionado">
          <section class="mb-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Reportes</h2>
            <p class="text-sm text-gray-500">Genera y descarga reportes académicos</p>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div
              v-for="reporte in reportesDisponibles"
              :key="reporte.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    reporte.color === 'blue' ? 'bg-blue-100' : '',
                    reporte.color === 'green' ? 'bg-green-100' : '',
                    reporte.color === 'violet' ? 'bg-violet-100' : '',
                    reporte.color === 'amber' ? 'bg-amber-100' : '',
                    reporte.color === 'cyan' ? 'bg-cyan-100' : '',
                  ]"
                >
                  <i
                    :class="[
                      'pi',
                      reporte.icono,
                      'text-xl',
                      reporte.color === 'blue' ? 'text-blue-600' : '',
                      reporte.color === 'green' ? 'text-green-600' : '',
                      reporte.color === 'amber' ? 'text-amber-600' : '',
                      reporte.color === 'violet' ? 'text-violet-600' : '',
                      reporte.color === 'cyan' ? 'text-cyan-600' : '',
                    ]"
                  ></i>
                </div>

                <h3 class="font-bold text-gray-800">
                  {{ reporte.nombre }}
                </h3>
              </div>

              <p class="text-sm text-gray-600 mb-4">
                {{ reporte.descripcion }}
              </p>

              <button
                @click="abrirFormulario(reporte.id)"
                class="w-full px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Generar Reporte
              </button>
            </div>
          </div>
        </div>

        <!-- FORMULARIOS -->
        <div v-else>
          <reportBoleta v-if="reporteSeleccionado === 1" @cerrar="cerrarFormulario" />

          <reportConducta v-if="reporteSeleccionado === 2" @cerrar="cerrarFormulario" />

          <reportDocente v-if="reporteSeleccionado === 3" @cerrar="cerrarFormulario" />

          <Rendimiento v-if="reporteSeleccionado === 4" @cerrar="cerrarFormulario" />
        </div>
      </div>

      <!-- HISTORIAL -->
      <div v-if="tabActiva === 'historial'" class="p-6 lg:p-8">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Historial de Reportes</h2>
            <p class="text-sm text-gray-500 mt-1">Consulta los reportes generados anteriormente</p>
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
                  <td class="px-6 py-4">Libreta de Calificaciones</td>

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
                        @click="mostrarBoleta = true"
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
                  <td class="px-6 py-4">Reporte de Conducta</td>

                  <td class="px-6 py-4">10/06/2026</td>

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
                  <td class="px-6 py-4">Informe del Profesor</td>

                  <td class="px-6 py-4">08/06/2026</td>

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
                        @click="mostrarInforme = true"
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
                  <td class="px-6 py-4">Reporte de Rendimiento</td>

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
                        @click="mostrarRendimiento = true"
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

      <div v-if="mostrarBoleta" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
        <div class="flex justify-center py-10">
          <boletaPDF @cerrar="cerrarBoleta" />
        </div>
      </div>

      <div v-if="mostrarConducta" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
        <div class="flex justify-center py-10">
          <conductaPDF @cerrar="cerrarConducta" />
        </div>
      </div>

      <div v-if="mostrarInforme" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
        <div class="flex justify-center py-10">
          <informePDF @cerrar="cerrarInforme" />
        </div>
      </div>

      <div v-if="mostrarRendimiento" class="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
        <div class="flex justify-center py-10">
          <rendimientoPDF @cerrar="cerrarRendimiento" />
        </div>
      </div>
    </main>
  </div>
</template>

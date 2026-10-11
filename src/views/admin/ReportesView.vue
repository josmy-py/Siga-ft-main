<script setup>
import { ref } from "vue";
import TablaReporte from "@/modules/Admin/Reportes.vue";
import modelReporte from "@/modules/Admin/modelReporte.vue";
import historialReporte from "@/modules/Admin/Forms/reports/historialReporte.vue";

import Academico from "@/modules/Admin/Forms/reports/Academico.vue";
import Conducta from "@/modules/Admin/Forms/reports/Conducta.vue";
import Docente from "@/modules/Admin/Forms/reports/Docente.vue";
import Institucional from "@/modules/Admin/Forms/reports/Institucional.vue";

const vista = ref("dashboard");
const estadoSeleccionado = ref("");

const abrirHistorial = () => {
  vista.value = "historial";
};

const mostrarModal = ref(false);
const formularioActivo = ref(null);

const abrirTabla = (estado) => {
  estadoSeleccionado.value = estado;
  vista.value = "tabla";
};

const volver = () => {
  vista.value = "dashboard";
};

const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const seleccionarFormulario = (tipo) => {
  formularioActivo.value = tipo;
  mostrarModal.value = false;
  vista.value = "formulario";
};

const cerrarFormulario = () => {
  formularioActivo.value = null;
  vista.value = "dashboard";
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Reportes</h1>
          </div>
        </div>
      </header>

      <div v-if="vista === 'dashboard'" class="p-4 lg:p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-800">Reportes</h2>

            <p class="text-gray-500 text-sm mt-1">
              Crea, gestiona y recibe reportes institucionales.
            </p>
          </div>

          <div class="flex gap-3 mt-4 md:mt-0">
            <button
              @click="abrirModal"
              class="flex items-center border border-violet-600 gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white"
            >
              <i class="pi pi-plus"></i>
              Nuevo reporte
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            @click="abrirHistorial"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:border-violet-300 hover:bg-violet-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <i class="pi pi-file text-violet-600 text-xl"></i>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800">Reportes Creados</h3>

                <p class="text-sm text-gray-500">Historial de reporte institucional</p>
              </div>
            </div>
          </button>

          <button
            @click="abrirTabla('recibido')"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="pi pi-inbox text-blue-600 text-xl"></i>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800">Recibidos</h3>

                <p class="text-sm text-gray-500">Ver reportes recibidos</p>
              </div>
            </div>
          </button>

          <button
            @click="abrirTabla('atendido')"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:border-green-300 hover:bg-green-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i class="pi pi-check-circle text-green-600 text-xl"></i>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800">Atendidos</h3>

                <p class="text-sm text-gray-500">Reportes resueltos</p>
              </div>
            </div>
          </button>

          <button
            @click="abrirTabla('pendiente')"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <i class="pi pi-clock text-orange-500 text-xl"></i>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800">Pendientes</h3>

                <p class="text-sm text-gray-500">Por revisar</p>
              </div>
            </div>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
          <div class="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
            <div class="flex justify-between items-center mb-5">
              <div>
                <h2 class="font-semibold text-gray-800">Tendencia de reportes</h2>

                <p class="text-sm text-gray-500">Últimos 6 meses</p>
              </div>

              <i class="pi pi-chart-line text-violet-600 text-xl"></i>
            </div>

            <div class="h-72 flex items-end justify-around">
              <div class="h-20 w-10 bg-violet-200 rounded-t"></div>
              <div class="h-32 w-10 bg-violet-300 rounded-t"></div>
              <div class="h-24 w-10 bg-violet-300 rounded-t"></div>
              <div class="h-40 w-10 bg-violet-400 rounded-t"></div>
              <div class="h-52 w-10 bg-violet-600 rounded-t"></div>
              <div class="h-44 w-10 bg-violet-500 rounded-t"></div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <i class="pi pi-chart-pie text-violet-600"></i>

              <h2 class="font-semibold">Distribución</h2>
            </div>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Académicos</span>
                  <span>45%</span>
                </div>

                <div class="bg-gray-100 rounded-full h-2">
                  <div class="bg-violet-600 h-2 rounded-full w-[45%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Conducta</span>
                  <span>30%</span>
                </div>

                <div class="bg-gray-100 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full w-[30%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Asistencia</span>
                  <span>15%</span>
                </div>

                <div class="bg-gray-100 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full w-[15%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Institucionales</span>
                  <span>10%</span>
                </div>

                <div class="bg-gray-100 rounded-full h-2">
                  <div class="bg-orange-500 h-2 rounded-full w-[10%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="vista === 'tabla'" class="p-4 lg:p-6">
        <button @click="volver" class="mb-4 px-4 py-2 border rounded-lg hover:bg-gray-100">
          ← Volver
        </button>

        <TablaReporte :estado="estadoSeleccionado" />
      </div>

      <modelReporte
        v-if="mostrarModal"
        @cerrar="cerrarModal"
        @seleccionar="seleccionarFormulario"
      />

      <div v-else-if="vista === 'historial'" class="p-4 lg:p-6">
        <button
          @click="volver"
          class="mb-4 border border-transparent bg-transparent flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <i class="pi pi-arrow-left"></i>
          Regresar
        </button>

        <historialReporte />
      </div>

      <div v-if="vista === 'formulario'">
        <Academico v-if="formularioActivo === 'academico'" @cerrar="cerrarFormulario" />

        <Conducta v-else-if="formularioActivo === 'conducta'" @cerrar="cerrarFormulario" />

        <Docente v-else-if="formularioActivo === 'docente'" @cerrar="cerrarFormulario" />

        <Institucional
          v-else-if="formularioActivo === 'institucional'"
          @cerrar="cerrarFormulario"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Asignacion from "@/modules/Admin/Forms/Asignaciones.vue";

const mostrarAsignacion = ref(false);

const abrirAsignacion = () => {
  mostrarAsignacion.value = true;
};

const cerrarAsignacion = () => {
  mostrarAsignacion.value = false;
};
</script>

<template>
  <div class="relative min-h-screen bg-slate-100 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-slate-800">Asignaciones Académicas</h1>

            <p class="text-sm text-slate-500">Gestión de asignaciones de docentes</p>
          </div>
        </div>
      </header>

      <div class="p-6">
        <div v-if="!mostrarAsignacion">
          <div class="flex justify-end mb-6">
            <button
              @click="abrirAsignacion"
              class="flex border border-transparent items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition"
            >
              <i class="pi pi-plus"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="i in 2"
              :key="i"
              class="bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200"
            >
              <div class="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500"></div>

              <div class="p-5">
                <div class="flex items-center gap-4 mb-5">
                  <div class="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <i class="pi pi-user text-blue-600 text-2xl"></i>
                  </div>

                  <div>
                    <h3 class="font-bold text-slate-800 text-lg">Ana Marta González</h3>

                    <p class="text-sm text-slate-500">Docente Asignado</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <i class="pi pi-graduation-cap text-blue-600"></i>

                    <span class="text-slate-700 font-medium"> Grados </span>

                    <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs"> 3 </span>
                  </div>

                  <div class="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                    <i class="pi pi-book text-green-500"></i>

                    <span class="text-slate-700 font-medium"> Materias </span>

                    <span class="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs">
                      5
                    </span>
                  </div>

                  <div class="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3">
                    <i class="pi pi-th-large text-violet-500"></i>

                    <span class="text-slate-700 font-medium"> Secciones </span>

                    <span class="px-3 py-1 rounded-full bg-violet-600 text-white text-xs"> 4 </span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-t border-slate-200">
                <button
                  class="py-3 border border-gray-500 rounded-2xl hover:bg-gray-300 transition"
                >
                  <i class="pi pi-eye"></i>
                </button>

                <button
                  class="py-3 rounded-2xl border border-transparent bg-blue-500 hover:bg-blue-600 text-white transition"
                >
                  <i class="pi pi-pencil"></i>
                </button>

                <button
                  class="py-3 rounded-2xl bg-red-500 border border-transparent hover:bg-red-600 text-white transition"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Asignacion v-if="mostrarAsignacion" @cerrar="cerrarAsignacion" />
      </div>
    </main>
  </div>
</template>

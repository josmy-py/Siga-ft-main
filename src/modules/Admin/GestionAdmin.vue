<script setup>
import { ref } from "vue";
import SeccionesView from "@/views/admin/SeccionesView.vue";
import GradosView from "@/views/admin/GradoView.vue";
import MateriasView from "@/views/admin/MateriaView.vue";
import EspecialidadesView from "@/views/admin/EspecialidadView.vue";

const catalogos = ref("");
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Catálogos</h1>
          </div>
        </div>
      </header>

      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 mb-5">
          <button
            @click="catalogos = 'grados'"
            class="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div class="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

            <div class="flex flex-col items-start">
              <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <i class="pi pi-graduation-cap text-2xl text-blue-600"></i>
              </div>

              <h2 class="mt-5 text-xl font-bold text-gray-800">Grados</h2>

              <p class="text-gray-500 text-sm mt-2">Gestionar niveles académicos.</p>
            </div>
          </button>

          <button
            @click="catalogos = 'materias'"
            class="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div class="absolute top-0 left-0 w-2 h-full bg-green-500"></div>

            <div class="flex flex-col items-start">
              <div class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <i class="pi pi-book text-2xl text-green-600"></i>
              </div>

              <h2 class="mt-5 text-xl font-bold text-gray-800">Materias</h2>

              <p class="text-gray-500 text-sm mt-2">Administrar asignaturas.</p>
            </div>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            @click="catalogos = 'secciones'"
            class="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div class="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>

            <div class="flex flex-col items-start">
              <div class="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <i class="pi pi-th-large text-2xl text-purple-600"></i>
              </div>

              <h2 class="mt-5 text-xl font-bold text-gray-800">Secciones</h2>

              <p class="text-gray-500 text-sm mt-2">Organizar grupos y aulas.</p>
            </div>
          </button>

          <button
            @click="catalogos = 'especialidades'"
            class="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div class="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>

            <div class="flex flex-col items-start">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <i class="pi pi-star text-2xl text-amber-600"></i>
              </div>

              <h2 class="mt-5 text-xl font-bold text-gray-800">Especialidades</h2>

              <p class="text-gray-500 text-sm mt-2">Gestionar áreas de estudio.</p>
            </div>
          </button>
        </div>

        <div class="mt-8">
          <SeccionesView v-if="catalogos === 'secciones'" />
        </div>

        <div class="mt-8">
          <GradosView v-if="catalogos === 'grados'" />
        </div>

        <div class="mt-8">
          <MateriasView v-if="catalogos === 'materias'" />
        </div>

        <div class="mt-8">
          <EspecialidadesView v-if="catalogos === 'especialidades'" />
        </div>
      </div>
    </main>
  </div>
</template>

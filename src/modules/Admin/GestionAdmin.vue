<script setup>
import { ref } from "vue";
import SeccionesView from "@/views/admin/SeccionesView.vue";
import GradosView from "@/views/admin/GradoView.vue";
import PlanesEstudioView from "@/views/admin/PlanEstudioView.vue";
import EspecialidadesView from "@/views/admin/EspecialidadView.vue";
import DiscapacidadesView from "@/views/admin/DiscapacidadView.vue";
import EnfermedadesView from "@/views/admin/EnfermedadView.vue";

// M2.5: las materias se administran dentro de su plan de estudios (D-C1) y
// discapacidades y enfermedades tienen su propia pantalla (D-C2)
const tarjetas = [
  { clave: "grados", titulo: "Grados", texto: "Gestionar niveles académicos.", icono: "pi-graduation-cap", barra: "bg-blue-500", fondo: "bg-blue-100", color: "text-blue-600" },
  { clave: "planes", titulo: "Planes de estudio", texto: "Planes por grado y sus materias.", icono: "pi-book", barra: "bg-green-500", fondo: "bg-green-100", color: "text-green-600" },
  { clave: "secciones", titulo: "Secciones", texto: "Organizar grupos y aulas.", icono: "pi-th-large", barra: "bg-purple-500", fondo: "bg-purple-100", color: "text-purple-600" },
  { clave: "especialidades", titulo: "Especialidades", texto: "Gestionar áreas de estudio.", icono: "pi-star", barra: "bg-amber-500", fondo: "bg-amber-100", color: "text-amber-600" },
  { clave: "discapacidades", titulo: "Discapacidades", texto: "Opciones de la ficha de salud.", icono: "pi-shield", barra: "bg-teal-500", fondo: "bg-teal-100", color: "text-teal-600" },
  { clave: "enfermedades", titulo: "Enfermedades", texto: "Enfermedades y su medicamento.", icono: "pi-heart", barra: "bg-rose-500", fondo: "bg-rose-100", color: "text-rose-600" },
];

const catalogos = ref("");
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">

      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-3 mb-5">
          <button
            v-for="tarjeta in tarjetas"
            :key="tarjeta.clave"
            @click="catalogos = tarjeta.clave"
            class="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border"
            :class="catalogos === tarjeta.clave ? 'border-slate-400 shadow-md' : 'border-gray-100'"
          >
            <div class="absolute top-0 left-0 w-2 h-full" :class="tarjeta.barra"></div>

            <div class="flex flex-col items-start">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :class="tarjeta.fondo">
                <i class="pi text-2xl" :class="[tarjeta.icono, tarjeta.color]"></i>
              </div>

              <h2 class="mt-5 text-xl font-bold text-gray-800">{{ tarjeta.titulo }}</h2>

              <p class="text-gray-500 text-sm mt-2">{{ tarjeta.texto }}</p>
            </div>
          </button>
        </div>

        <div class="mt-8">
          <GradosView v-if="catalogos === 'grados'" />
          <PlanesEstudioView v-else-if="catalogos === 'planes'" />
          <SeccionesView v-else-if="catalogos === 'secciones'" />
          <EspecialidadesView v-else-if="catalogos === 'especialidades'" />
          <DiscapacidadesView v-else-if="catalogos === 'discapacidades'" />
          <EnfermedadesView v-else-if="catalogos === 'enfermedades'" />
        </div>
      </div>
    </main>
  </div>
</template>

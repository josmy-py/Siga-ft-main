<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";
import SelectorTipoMatricula from "./SelectorTipoMatricula.vue";
import BusquedaEstudiante from "./BusquedaEstudiante.vue";
import FichaDatosAcademicos from "./FichaDatosAcademicos.vue";

// IMPORTACIÓN CORREGIDA: Apuntando exactamente a tu archivo orquestador
import FichaEncargado from "./FichaEncargado.vue";

const router = useRouter();

const matriculaStore = useMatriculaStore();
const {
  estadoMatricula,
  pestañaActiva,
  tipoMatricula,
  pasoAntiguo,
  estudianteSeleccionado,
  labelTipoMatricula,
  esNuevoIngreso,
  esAntiguoIngreso,
} = storeToRefs(matriculaStore);

const estiloTab = (pest) =>
  pestañaActiva.value === pest
    ? "border-blue-600 text-blue-600 font-bold bg-blue-50/50"
    : "border-transparent text-gray-500 hover:text-gray-750 hover:bg-gray-50";

const cancelarTodo = () => {
  matriculaStore.resetearTodo();
};

const confirmarMatricula = async () => {
  const datosEncargado =
    esAntiguoIngreso.value &&
    !matriculaStore.encargadoManual &&
    matriculaStore.encargadoSeleccionado
      ? matriculaStore.encargadoSeleccionado
      : matriculaStore.encargado;

  const payload = {
    tipo: tipoMatricula.value,
    estudiante: {
      ...matriculaStore.estudiante,
      foto: matriculaStore.fotoPreview || estudianteSeleccionado.value?.foto || "",
    },
    encargado: datosEncargado,
    salud: matriculaStore.salud,
    matriculaDetails: {
      gradoId: matriculaStore.gradoSelected,
      especialidad: matriculaStore.especialidadSelected,
      turnoId: matriculaStore.turnoSelected,
      repiteGrado: esAntiguoIngreso.value ? matriculaStore.repiteGrado : null,
    },
  };

  try {
    console.log("Enviando matrícula:", payload);
    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success",
    });
    matriculaStore.resetearTodo();
    router.push("/cliente/registro");
  } catch {
    alert("Hubo un error al procesar la matrícula.");
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 md:flex">
    <main class="flex-1 transition-all duration-300 flex flex-col">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Ficha de Matrícula</h1>
            </div>
          </div>

          <span
            v-if="tipoMatricula"
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700"
          >
            {{ labelTipoMatricula }}
          </span>
        </div>
      </div>

      <div class="p-6 flex-1">
        <div class="w-full">
          <!-- PASO 0: SELECCIÓN DE TIPO DE MATRÍCULA -->
          <SelectorTipoMatricula v-if="!tipoMatricula" />

          <!-- PASO 1 (Antiguo): BÚSQUEDA DE ESTUDIANTE -->
          <BusquedaEstudiante v-else-if="esAntiguoIngreso && pasoAntiguo === 'busqueda'" />

          <!-- PASO 1+: FORMULARIO DE MATRÍCULA -->
          <div v-else class="animate-fade-in">
            <!-- TABS -->
            <div class="flex border-b border-gray-200 bg-gray-50/50">
              <button
                @click="pestañaActiva = 'dato'"
                :class="[
                  'flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-all duration-200 outline-none',
                  estiloTab('dato'),
                ]"
              >
                {{ esNuevoIngreso ? "Datos del Estudiante" : "Datos Academicos" }}
              </button>
              <button
                @click="pestañaActiva = 'encar'"
                :class="[
                  'flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-all duration-200 outline-none',
                  estiloTab('encar'),
                ]"
              >
                Encargado
              </button>
            </div>

            <div class="p-6 w-full">
              <!-- TAB: Datos Academicos / Estudiante -->
              <div v-if="pestañaActiva === 'dato'" class="animate-fade-in">
                <FichaDatosAcademicos />
              </div>

              <!-- TAB: Encargado -->
              <div v-if="pestañaActiva === 'encar'" class="animate-fade-in max-w-3xl mx-auto">
                <!-- VISTA LIMPIA: Llamamos a tu componente orquestador -->
                <FichaEncargado />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer: botones de acción -->
      <div
        v-if="tipoMatricula"
        class="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
      >
        <div class="flex gap-3">
          <button
            @click="cancelarTodo"
            type="button"
            class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
          >
            Cancelar Todo
          </button>
        </div>
        <button
          v-if="
            (esNuevoIngreso && tipoMatricula) || (esAntiguoIngreso && pasoAntiguo === 'formulario')
          "
          @click="confirmarMatricula"
          type="button"
          class="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2 text-sm"
        >
          Confirmar Matrícula
          <i class="pi pi-check"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

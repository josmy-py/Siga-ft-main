<script setup>
import { useRouter } from "vue-router";
import { useMatriculaStore } from "@/stores/matricula";

const router = useRouter();
const matriculaStore = useMatriculaStore();

const seleccionarTipoMatricula = (tipo) => {
  matriculaStore.seleccionarTipoMatricula(tipo);
};
</script>

<template>
  <div class="animate-fade-in max-w-2xl mx-auto relative pt-4">
    <button
      @click="router.back()"
      class="absolute left-0 top-4 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition font-medium flex items-center gap-2 text-sm"
    >
      <i class="pi pi-arrow-left"></i> Cancelar
    </button>

    <h2 class="text-xl font-semibold text-gray-800 mb-2 text-center mt-12">
      Tipo de Matrícula
    </h2>
    <p class="text-gray-500 text-sm text-center mb-8">
      Selecciona el tipo de matrícula que deseas realizar.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        @click="seleccionarTipoMatricula('nuevo')"
        class="border-2 border-blue-100 rounded-xl p-6 hover:bg-blue-50 transition text-left shadow-sm hover:border-blue-300"
      >
        <div class="flex items-center gap-4">
          <i class="pi pi-user-plus text-3xl text-blue-600"></i>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">Nuevo Ingreso</h3>
            <p class="text-sm text-gray-500 mt-0.5">
              Estudiantes que ingresan por primera vez.
            </p>
          </div>
        </div>
      </button>

      <button
        @click="seleccionarTipoMatricula('antiguo')"
        class="border-2 border-violet-100 rounded-xl p-6 hover:bg-violet-50 transition text-left shadow-sm hover:border-violet-300"
      >
        <div class="flex items-center gap-4">
          <i class="pi pi-sync text-3xl text-violet-600"></i>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">Antiguo Ingreso</h3>
            <p class="text-sm text-gray-500 mt-0.5">
              Estudiantes que continúan en la institución.
            </p>
          </div>
        </div>
      </button>
    </div>
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

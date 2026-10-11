<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";

const matriculaStore = useMatriculaStore();
// 1. Extraemos la variable correcta del store
const { estudiantesBuscados, cargando } = storeToRefs(matriculaStore);

const nieBusqueda = ref("");

// 2. Simplificamos la función para que use el Backend/Servicio
const buscarEstudiante = async () => {
  const termino = nieBusqueda.value.trim();
  
  if (!termino) {
    estudiantesBuscados.value = [];
    return;
  }
  
  // Ejecutamos la acción del store
  await matriculaStore.buscarEstudiante(termino);
};

const seleccionarEstudiante = (estudiante) => {
  matriculaStore.seleccionarEstudiante(estudiante);
};

const volverASeleccionTipo = () => {
  matriculaStore.tipoMatricula = "";
  matriculaStore.pasoAntiguo = "busqueda";
  // Limpiar la búsqueda al salir
  estudiantesBuscados.value = [];
  nieBusqueda.value = "";
};

const hasBusqueda = computed(() => nieBusqueda.value.trim().length > 0);
</script>

<template>
  <div class="animate-fade-in max-w-2xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <button
        @click="volverASeleccionTipo"
        class="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600"
      >
        <i class="pi pi-arrow-left text-xl"></i>
      </button>
      <h2 class="text-xl font-semibold text-gray-800">Buscar Estudiante</h2>
    </div>

    <p class="text-gray-500 text-sm mb-6">
      Ingresa el NIE del estudiante que deseas matricular en el nuevo ciclo.
    </p>

    <div class="flex gap-3 mb-6">
      <input
        v-model="nieBusqueda"
        @keyup.enter="buscarEstudiante"
        type="text"
        placeholder="Número de Identidad (NIE)"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        @click="buscarEstudiante"
        :disabled="cargando"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i :class="cargando ? 'pi pi-spinner pi-spin' : 'pi pi-search'"></i>
        {{ cargando ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>

    <!-- 3. Iteramos sobre la variable global del store en lugar de la local -->
    <div v-if="estudiantesBuscados.length > 0" class="space-y-3">
      <div
        v-for="est in estudiantesBuscados"
        :key="est.id"
        @click="seleccionarEstudiante(est)"
        class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition flex items-center gap-4"
      >
        <div
          class="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden"
        >
          <img v-if="est.foto" :src="est.foto" class="w-full h-full object-cover" />
          <i v-else class="pi pi-user text-xl text-gray-400"></i>
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-800">{{ est.nombres }}</p>
          <p class="text-sm text-gray-500">NIE: {{ est.NIE }}</p>
          <p class="text-xs text-gray-400">
            Grados actuales: {{ est.gradoActual || 'N/A' }} - {{ est.turnoActual || 'N/A' }}
          </p>
        </div>
        <i class="pi pi-chevron-right text-gray-400"></i>
      </div>
    </div>

    <div
      v-else-if="hasBusqueda && !estudiantesBuscados.length && !cargando"
      class="text-center py-8 text-gray-400"
    >
      <i class="pi pi-search text-3xl mb-2"></i>
      <p>No se encontraron estudiantes con el NIE ingresado.</p>
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
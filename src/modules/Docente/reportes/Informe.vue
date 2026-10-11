<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["cerrar"]);

const informe = ref({
  tipoInforme: "",
  fecha: new Date().toISOString().split("T")[0],
  grado: "",
  seccion: "",
  profesor: "",
  periodo: "",
  asunto: "",
  contenido: "",
  observaciones: "",
  evidencia: null,
});

// Datos de ejemplo
const grados = ref([
  { id: 1, nombre: "Primer Grado" },
  { id: 2, nombre: "Segundo Grado" },
  { id: 3, nombre: "Tercer Grado" },
]);

const secciones = ref([
  {
    id: 1,
    nombre: "A",
    gradoId: 1,
  },
  {
    id: 2,
    nombre: "B",
    gradoId: 1,
  },
  {
    id: 3,
    nombre: "A",
    gradoId: 3,
  },
]);

const periodos = ref([
  { id: 1, nombre: "Primer Trimestre" },
  { id: 2, nombre: "Segundo Trimestre" },
  { id: 3, nombre: "Tercer Trimestre" },
]);

const seccionesFiltradas = computed(() => {
  return secciones.value.filter((s) => s.gradoId == informe.value.grado);
});

const guardarInforme = () => {
  console.log(informe.value);
};

const limpiarFormulario = () => {
  informe.value = {
    tipoInforme: "",
    fecha: new Date().toISOString().split("T")[0],
    grado: "",
    seccion: "",
    profesor: "",
    periodo: "",
    asunto: "",
    contenido: "",
    observaciones: "",
    evidencia: null,
  };
};
</script>

<template>
  <div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
    <h2 class="text-2xl font-bold mb-6">Generar Informe Profesor</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block mb-2 font-medium"> Tipo de Informe </label>

        <select v-model="informe.tipoInforme" class="w-full border border-gray-500 rounded-lg px-4 py-2">
          <option value="">Seleccione</option>
          <option>Informe Mensual</option>
          <option>Informe de Actividades</option>
          <option>Informe de Proyecto</option>
        </select>
      </div>

      <div>
        <label class="block mb-2 font-medium"> Fecha </label>

        <input type="date" v-model="informe.fecha" class="w-full border border-gray-500 rounded-lg px-4 py-2" />
      </div>

      <div>
        <label class="block mb-2 font-medium"> Grado </label>

        <select v-model="informe.grado" class="w-full border border-gray-500 rounded-lg px-4 py-2">
          <option value="">Seleccione un grado</option>

          <option v-for="grado in grados" :key="grado.id" :value="grado.id">
            {{ grado.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 font-medium"> Sección </label>

        <select v-model="informe.seccion" class="w-full border border-gray-500 rounded-lg px-4 py-2">
          <option value="">Seleccione una sección</option>

          <option v-for="seccion in seccionesFiltradas" :key="seccion.id" :value="seccion.id">
            {{ seccion.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 font-medium"> Prof. Responsable </label>

        <input
          type="text"
          v-model="informe.profesor"
          placeholder="Ingrese el nombre del profesor"
          class="w-full border border-gray-500 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label class="block mb-2 font-medium"> Período Académico </label>

        <select v-model="informe.periodo" class="w-full border border-gray-500 rounded-lg px-4 py-2">
          <option value="">Seleccione un período</option>

          <option v-for="periodo in periodos" :key="periodo.id" :value="periodo.id">
            {{ periodo.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Asunto -->
    <div class="mt-6">
      <label class="block mb-2 font-medium"> Asunto </label>

      <input
        type="text"
        v-model="informe.asunto"
        class="w-full border border-gray-500 rounded-lg px-4 py-2"
        placeholder="Ingrese el asunto"
      />
    </div>

    <!-- Desarrollo -->
    <div class="mt-6">
      <label class="block mb-2 font-medium"> Desarrollo del Informe </label>

      <textarea
        v-model="informe.contenido"
        rows="8"
        class="w-full border border-gray-500 rounded-lg px-4 py-2"
        placeholder="Describa las actividades realizadas..."
      ></textarea>
    </div>

    <div class="mt-6">
      <label class="block mb-2 font-medium"> Observaciones </label>

      <textarea
        v-model="informe.observaciones"
        rows="4"
        class="w-full border border-gray-500 rounded-lg px-4 py-2"
      ></textarea>
    </div>

    <div class="mt-6">
      <label class="block mb-2 font-medium"> Adjuntar Evidencia </label>

      <input type="file" class="w-full border border-gray-500 rounded-lg px-4 py-2" />
    </div>

    <div class="flex justify-end gap-4 mt-8">
      <button
        @click="limpiarFormulario"
        class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
      >
        <i class="pi pi-replay mr-2"></i>
        Limpiar
      </button>

      <button
        type="button"
        @click="emit('cerrar')"
        class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
      >
        <i class="pi pi-times mr-2"></i>
        Cancelar
      </button>

      <button @click="guardarInforme" class="px-5 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg">
        Generar Informe
      </button>
    </div>
  </div>
</template>

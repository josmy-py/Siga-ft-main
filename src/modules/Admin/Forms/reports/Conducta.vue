<template>
  <div class="bg-slate-50 min-h-screen p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Encabezado -->
      <div
        class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h1 class="text-3xl font-bold">Reporte de Conducta </h1>
        <p class="text-indigo-100 mt-2">
          Registro de comportamiento academico.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

  <!-- Encabezado -->
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"
    >
      <i class="pi pi-shield text-red-600 text-xl"></i>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-gray-800">
        Reporte de Conducta y Convivencia Escolar
      </h2>
    </div>
  </div>

  <!-- Identificación -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-building text-indigo-500"></i>
      Identificación
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <select
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      >
        <option>Primer Trimestre</option>
        <option>Segundo Trimestre</option>
        <option>Tercer Trimestre</option>
        <option>Final</option>
      </select>

      <input
        type="date"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="text"
        placeholder="Director Responsable"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Resumen -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-chart-bar text-violet-500"></i>
      Resumen General
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Total de Estudiantes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Total de Incidentes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Casos Resueltos"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Casos Pendientes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Tipos de Reportes -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-exclamation-triangle text-orange-500"></i>
      Clasificación de Reportes
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="number"
        placeholder="Reportes Leves"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Reportes Moderados"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Reportes Graves"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Incidentes -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-flag text-red-500"></i>
      Incidentes Registrados
    </h3>

    <textarea
      rows="5"
      placeholder="Descripción general de incidentes ocurridos durante el período..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Medidas -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-gavel text-blue-500"></i>
      Medidas Disciplinarias Aplicadas
    </h3>

    <div class="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
      <label class="flex items-center gap-2">
        <input type="checkbox" />
        Amonestación Verbal
      </label>

      <label class="flex items-center gap-2">
        <input type="checkbox" />
        Amonestación Escrita
      </label>

      <label class="flex items-center gap-2">
        <input type="checkbox" />
        Citación a Padres
      </label>

      <label class="flex items-center gap-2">
        <input type="checkbox" />
        Suspensión
      </label>
    </div>

    <textarea
      rows="4"
      placeholder="Detalle de medidas disciplinarias aplicadas..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Casos relevantes -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-file-edit text-purple-500"></i>
      Casos Relevantes
    </h3>

    <textarea
      rows="6"
      placeholder="Describa los casos más relevantes y el seguimiento realizado..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Recomendaciones -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-lightbulb text-amber-500"></i>
      Recomendaciones
    </h3>

    <textarea
      rows="4"
      placeholder="Acciones preventivas y recomendaciones para mejorar la convivencia escolar..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Observaciones -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-comment text-gray-500"></i>
      Observaciones Generales
    </h3>

    <textarea
      rows="5"
      placeholder="Observaciones adicionales..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Botones -->
  <div class="flex justify-end gap-3">
    <button
    @click="emit('cerrar')"
      class="px-5 py-3 rounded-xl border border-gray-300 text-gray-700"
    >
      Cancelar
    </button>

    <button
      class="px-6 py-3 rounded-xl border border-violet-600 bg-violet-600 text-white flex items-center gap-2"
    >
      <i class="pi pi-file-pdf"></i>
      Generar Reporte
    </button>
  </div>

</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["cerrar"]);


const reporte = ref({
  institucion: "",
  nivel: "",
  fecha: "",

  director: "",
  cargo: "",
  correo: "",

  totalEstudiantes: null,
  promedioGeneral: null,
  destacados: "",
  calificaciones: "",

  incidentes: null,
  reportesLeves: null,
  reportesGraves: null,
  medidas: null,
  casos: "",

  totalActividades: null,
  totalProyectos: null,
  actividadesDescripcion: "",

  matricula: null,
  ingresos: null,
  reprobados: null,

  docentes: null,
  docentesAusentes: null,

  observaciones: "",
});
</script>

<style scoped>
.input {
  @apply w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}

.textarea {
  @apply w-full px-4 py-3 border border-slate-300 rounded-xl outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}
</style>

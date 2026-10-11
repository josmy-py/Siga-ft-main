<template>
  <div class="bg-slate-50 min-h-screen p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Encabezado -->
      <div
        class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h1 class="text-3xl font-bold">Reporte del Personal Docente </h1>
        <p class="text-indigo-100 mt-2">
          Registro y consolidación de información sobre el personal
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

  <!-- Encabezado -->
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center"
    >
      <i class="pi pi-users text-sky-600 text-xl"></i>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-gray-800">
        Reporte de Personal Docente
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
        placeholder="Director"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Estadísticas Docentes -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-chart-bar text-violet-500"></i>
      Estadísticas Generales
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="number"
        placeholder="Total de Docentes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Docentes Activos"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Docentes Ausentes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Asistencia -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-calendar text-green-500"></i>
      Control de Asistencia
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Asistencia Promedio (%)"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Incapacidades"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <!-- Desempeño -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-star text-yellow-500"></i>
      Desempeño Docente
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <input
        type="number"
        placeholder="Docentes Evaluados"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Promedio de Evaluación"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>

    <textarea
      rows="4"
      placeholder="Descripción general del desempeño docente..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Capacitaciones -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-graduation-cap text-purple-500"></i>
      Capacitaciones
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <input
        type="number"
        placeholder="Capacitaciones Realizadas"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Docentes Participantes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>

    <textarea
      rows="4"
      placeholder="Detalle de capacitaciones desarrolladas..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Reconocimientos -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-trophy text-amber-500"></i>
      Reconocimientos y Logros
    </h3>

    <textarea
      rows="4"
      placeholder="Docentes destacados y logros obtenidos..."
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
      placeholder="Observaciones adicionales sobre el personal docente..."
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

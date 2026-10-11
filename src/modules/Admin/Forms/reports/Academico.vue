<template>
  <div class="bg-slate-50 min-h-screen p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div
        class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h1 class="text-3xl font-bold">Reporte Académico</h1>
        <p class="text-indigo-100 mt-2">
          Registro y consolidación de información académica y administrativa.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center"
    >
      <i class="pi pi-chart-line text-violet-600 text-xl"></i>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-gray-800">
        Reporte Académico
      </h2>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-building text-indigo-500"></i>
      Identificación
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div>
        <label class="block text-sm text-gray-600 mb-2">Nivel Académico</label>
        <select class="w-full px-4 py-3 border border-gray-200 rounded-xl">
          <option>Básica</option>
          <option>Bachillerato</option>
          <option>Institucional</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-2">Período</label>
        <select class="w-full px-4 py-3 border border-gray-200 rounded-xl">
          <option>Primer Trimestre</option>
          <option>Segundo Trimestre</option>
          <option>Tercer Trimestre</option>
          <option>Final</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-2">Fecha</label>
        <input
          type="date"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl"
        />
      </div>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-user text-emerald-500"></i>
      Responsable
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Nombre del Director"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <select class="w-full px-4 py-3 border border-gray-200 rounded-xl">
        <option>Director</option>
        <option>Subdirector</option>
      </select>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-chart-bar text-violet-500"></i>
      Indicadores Académicos
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Total Estudiantes"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="Promedio General"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="% Aprobación"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="number"
        placeholder="% Reprobación"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-book text-blue-500"></i>
      Rendimiento Académico
    </h3>

    <textarea
      rows="5"
      placeholder="Describa el rendimiento académico general observado durante el período..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-list text-orange-500"></i>
      Materias con Mayor y Menor Rendimiento
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Materia con mejor rendimiento"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />

      <input
        type="text"
        placeholder="Materia con menor rendimiento"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-star-fill text-yellow-500"></i>
      Estudiantes Destacados
    </h3>

    <textarea
      rows="4"
      placeholder="Listado o descripción de estudiantes destacados..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

  <!-- Recomendaciones -->
  <div class="mb-8">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <i class="pi pi-lightbulb text-amber-500"></i>
      Recomendaciones Académicas
    </h3>

    <textarea
      rows="5"
      placeholder="Acciones y recomendaciones para mejorar el rendimiento académico..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    ></textarea>
  </div>

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

  <div class="flex justify-end gap-3">
    <button
    @click="emit('cerrar')"
      class="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      Cancelar
    </button>

    <button
      class="px-6 py-3 border border-violet-600 rounded-xl bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
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

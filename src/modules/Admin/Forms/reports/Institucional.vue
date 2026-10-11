<template>


  <div class="bg-slate-50 min-h-screen p-6">

    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Encabezado -->
      <div
        class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h1 class="text-3xl font-bold">Reporte Institucional</h1>
        <p class="text-indigo-100 mt-2">
        Información general del informe institucional.
        </p>
      </div>

      <!-- IDENTIFICACIÓN DEL REPORTE -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center"
    >
      <i class="pi pi-building text-indigo-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Informe Institucional
      </h2>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div>
      <label class="text-sm font-medium text-gray-600 mb-2 block">
        Nivel Académico
      </label>
      <div class="relative">
        <i
          class="pi pi-book absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
        <select
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl"
        >
          <option>Básica</option>
          <option>Bachillerato</option>
          <option>Institucional</option>
        </select>
      </div>
    </div>

    <div>
      <label class="text-sm font-medium text-gray-600 mb-2 block">
        Fecha
      </label>
      <div class="relative">
        <i
          class="pi pi-calendar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
        <input
          type="date"
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl"
        />
      </div>
    </div>
  </div>
</div>

<!-- DATOS DEL DIRECTOR -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"
    >
      <i class="pi pi-user text-emerald-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Datos del Director
      </h2>
      <p class="text-sm text-slate-500">
        Información del responsable institucional.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="text-sm font-medium text-gray-600 mb-2 block">
        Nombre Completo
      </label>
      <input
        type="text"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>

    <div>
      <label class="text-sm font-medium text-gray-600 mb-2 block">
        Cargo
      </label>
      <select
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      >
        <option>Director</option>
        <option>Subdirector</option>
      </select>
    </div>

    <div>
      <label class="text-sm font-medium text-gray-600 mb-2 block">
        Correo Electrónico
      </label>
      <input
        type="email"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl"
      />
    </div>
  </div>
</div>

<!-- RENDIMIENTO ACADÉMICO -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center"
    >
      <i class="pi pi-chart-line text-violet-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Rendimiento Académico
      </h2>
      <p class="text-sm text-slate-500">
        Resultados académicos del período.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
    <input
      type="number"
      placeholder="Total de Estudiantes"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Promedio General"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="text"
      placeholder="Estudiantes Destacados"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />
  </div>

  <textarea
    rows="5"
    placeholder="Descripción general de calificaciones..."
    class="w-full px-4 py-3 border border-gray-200 rounded-xl"
  ></textarea>
</div>

<!-- CONDUCTA -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"
    >
      <i class="pi pi-shield text-red-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Conducta y Disciplina
      </h2>
      <p class="text-sm text-slate-500">
        Seguimiento conductual estudiantil.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
    <input
      type="number"
      placeholder="Incidentes"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Reportes Leves"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Reportes Graves"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Medidas Aplicadas"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />
  </div>

  <textarea
    rows="5"
    placeholder="Descripción de casos importantes..."
    class="w-full px-4 py-3 border border-gray-200 rounded-xl"
  ></textarea>
</div>

<!-- ACTIVIDADES -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"
    >
      <i class="pi pi-calendar-plus text-amber-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Actividades Institucionales
      </h2>
      <p class="text-sm text-slate-500">
        Eventos y proyectos desarrollados.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
    <input
      type="number"
      placeholder="Total de Actividades"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Total de Proyectos"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />
  </div>

  <div class="grid grid-cols-2 md:grid-cols-2 gap-3 mb-5">
    <label class="flex items-center gap-2">
      <input type="checkbox" />
      Acto Cívico
    </label>

    <label class="flex items-center gap-2">
      <input type="checkbox" />
      Feria Científica
    </label>

    <label class="flex items-center gap-2">
      <input type="checkbox" />
      Torneo Deportivo
    </label>

    <label class="flex items-center gap-2">
      <input type="checkbox" />
      Actividad Cultural
    </label>
  </div>

  <textarea
    rows="5"
    placeholder="Descripción detallada de actividades y proyectos..."
    class="w-full px-4 py-3 border border-gray-200 rounded-xl"
  ></textarea>
</div>

<!-- CONTROL ESCOLAR -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center"
    >
      <i class="pi pi-book text-cyan-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Control Escolar
      </h2>
      <p class="text-sm text-slate-500">
        Información de matrícula y rendimiento.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input
      type="number"
      placeholder="Matrícula Total"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Nuevos Ingresos"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Estudiantes Reprobados"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />
  </div>
</div>

<!-- RECURSOS HUMANOS -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center"
    >
      <i class="pi pi-users text-sky-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Recursos Humanos
      </h2>
      <p class="text-sm text-slate-500">
        Información del personal docente.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="number"
      placeholder="Total de Docentes"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />

    <input
      type="number"
      placeholder="Docentes Ausentes"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl"
    />
  </div>
</div>

<!-- OBSERVACIONES -->
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
    >
      <i class="pi pi-comment text-gray-600 text-xl"></i>
    </div>

    <div>
      <h2 class="font-semibold text-slate-800 text-lg">
        Observaciones Generales
      </h2>
      <p class="text-sm text-slate-500">
        Comentarios adicionales del reporte.
      </p>
    </div>
  </div>

  <textarea
    rows="6"
    placeholder="Escriba observaciones generales..."
    class="w-full px-4 py-3 border border-gray-200 rounded-xl"
  ></textarea>
</div>

<!-- BOTONES -->
<div class="flex justify-end gap-3 mt-6">
  <button
  @click="emit('cerrar')"
    class="px-5 py-3 rounded-xl border border-gray-300 flex items-center gap-2 hover:bg-gray-50"
  >
    <i class="pi pi-times"></i>
    Cancelar
  </button>

  <button
    class="px-6 py-3 rounded-xl border border-indigo-600 bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700"
  >
    <i class="pi pi-file-pdf"></i>
    Generar Reporte
  </button>
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

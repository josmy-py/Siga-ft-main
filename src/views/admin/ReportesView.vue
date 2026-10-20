<script setup>
import { ref } from "vue";
import TarjetasReportes from "@/components/reportes/TarjetasReportes.vue";
import Academico from "@/modules/Admin/Forms/reports/Academico.vue";
import Conducta from "@/modules/Admin/Forms/reports/Conducta.vue";

// Portal director > Reportes, misma vista de tarjetas que el docente.
// Académico y Conducta abren los reportes que ya existen (notas y conducta
// por sección y periodo); Docente e Institucional quedan sin formulario hasta
// que se definan.
const formularioActivo = ref(null);

const reportes = [
  {
    id: "academico",
    titulo: "Reporte Académico",
    descripcion: "Informe sobre el rendimiento académico",
    icono: "pi-graduation-cap",
    fondo: "bg-violet-100",
    color: "text-violet-600",
    disponible: true,
  },
  {
    id: "conducta",
    titulo: "Reporte de Conducta",
    descripcion: "Informe sobre comportamientos y situaciones",
    icono: "pi-id-card",
    fondo: "bg-blue-100",
    color: "text-blue-600",
    disponible: true,
  },
  {
    id: "docente",
    titulo: "Reporte Docente",
    descripcion: "Evaluación y seguimiento del desempeño docente",
    icono: "pi-users",
    fondo: "bg-green-100",
    color: "text-green-600",
    disponible: false,
  },
  {
    id: "institucional",
    titulo: "Reporte Institucional",
    descripcion: "Informe sobre asuntos generales de la institución",
    icono: "pi-building-columns",
    fondo: "bg-amber-100",
    color: "text-amber-600",
    disponible: false,
  },
];

const cerrarFormulario = () => {
  formularioActivo.value = null;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <TarjetasReportes v-if="!formularioActivo" :reportes="reportes" @generar="formularioActivo = $event" />

      <div v-else class="p-4 lg:p-6">
        <Academico v-if="formularioActivo === 'academico'" @cerrar="cerrarFormulario" />
        <Conducta v-else-if="formularioActivo === 'conducta'" @cerrar="cerrarFormulario" />
      </div>
    </main>
  </div>
</template>

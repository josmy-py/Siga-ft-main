<script setup>
import { ref } from "vue";
import TarjetasReportes from "@/components/reportes/TarjetasReportes.vue";
import reportBoleta from "@/modules/Docente/reportes/Boleta.vue";
import reportConducta from "@/modules/Docente/reportes/Conducta.vue";

// Portal docente > Reportes. Boletas y Conducta abren los reportes que ya
// existen (notas y conducta por sección y periodo); Informe Profesor y
// Reporte de Rendimiento quedan sin formulario hasta que se definan.
const reporteSeleccionado = ref(null);

const reportes = [
  {
    id: "notas",
    titulo: "Boletas de Calificaciones",
    descripcion: "Generar boletas de calificaciones por estudiante",
    icono: "pi-file",
    fondo: "bg-blue-100",
    color: "text-blue-600",
    disponible: true,
  },
  {
    id: "conducta",
    titulo: "Conducta",
    descripcion: "Reporte de evaluación de conducta",
    icono: "pi-star",
    fondo: "bg-amber-100",
    color: "text-amber-600",
    disponible: true,
  },
  {
    id: "informe-profesor",
    titulo: "Informe Profesor",
    descripcion: "Registro de actividades, observaciones realizadas por el profesor",
    icono: "pi-user",
    fondo: "bg-violet-100",
    color: "text-violet-600",
    disponible: false,
  },
  {
    id: "rendimiento",
    titulo: "Reporte de Rendimiento",
    descripcion: "Reporte de estadisticas y promedios academicos",
    icono: "pi-users",
    fondo: "bg-cyan-100",
    color: "text-cyan-600",
    disponible: false,
  },
];

const cerrarFormulario = () => {
  reporteSeleccionado.value = null;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <TarjetasReportes v-if="!reporteSeleccionado" :reportes="reportes" @generar="reporteSeleccionado = $event" />

      <div v-else class="p-6 lg:p-8">
        <reportBoleta v-if="reporteSeleccionado === 'notas'" @cerrar="cerrarFormulario" />
        <reportConducta v-if="reporteSeleccionado === 'conducta'" @cerrar="cerrarFormulario" />
      </div>
    </main>
  </div>
</template>

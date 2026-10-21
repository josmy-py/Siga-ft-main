<script setup>
import { ref } from "vue";
import TarjetasReportes from "@/components/reportes/TarjetasReportes.vue";
import Academico from "@/modules/Admin/Forms/reports/Academico.vue";
import Conducta from "@/modules/Admin/Forms/reports/Conducta.vue";
import Docente from "@/modules/Admin/Forms/reports/Docente.vue";
import Institucional from "@/modules/Admin/Forms/reports/Institucional.vue";

// Portal director > Reportes, misma vista de tarjetas que el docente.
// Cada tarjeta abre su formulario; no se guarda nada. Académico, Conducta y
// Docente se generan como PDF; Institucional se imprime desde el navegador
// hasta que llegue el diseño de su PDF.
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
    disponible: true,
  },
  {
    id: "institucional",
    titulo: "Reporte Institucional",
    descripcion: "Informe sobre asuntos generales de la institución",
    icono: "pi-building-columns",
    fondo: "bg-amber-100",
    color: "text-amber-600",
    disponible: true,
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
        <Docente v-else-if="formularioActivo === 'docente'" @cerrar="cerrarFormulario" />
        <Institucional v-else-if="formularioActivo === 'institucional'" @cerrar="cerrarFormulario" />
      </div>
    </main>
  </div>
</template>

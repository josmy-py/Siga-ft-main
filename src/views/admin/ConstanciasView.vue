<script setup>
import { ref } from "vue";
import TarjetasReportes from "@/components/reportes/TarjetasReportes.vue";
import Conducta from "@/modules/Admin/Forms/constancias/Conducta.vue";
import Egresado from "@/modules/Admin/Forms/constancias/Egresado.vue";

// Portal director > Constancias, misma vista de tarjetas que Reportes. Cada
// tarjeta abre su formulario; el PDF se genera con dompdf en el backend.
const formularioActivo = ref(null);

const constancias = [
  {
    id: "conducta",
    titulo: "Constancia de Conducta",
    descripcion: "Constancia de buena conducta del estudiante en la institución",
    icono: "pi-id-card",
    fondo: "bg-blue-100",
    color: "text-blue-600",
    disponible: true,
  },
  {
    id: "egresado",
    titulo: "Constancia de Egresado",
    descripcion: "Constancia para estudiantes que terminaron su bachillerato",
    icono: "pi-graduation-cap",
    fondo: "bg-violet-100",
    color: "text-violet-600",
    disponible: true,
  },
];
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <TarjetasReportes
        v-if="!formularioActivo"
        :reportes="constancias"
        titulo="Constancias"
        descripcion="Genera y descarga constancias de los estudiantes"
        boton="Generar Constancia"
        aviso="Esta constancia estará disponible próximamente."
        @generar="formularioActivo = $event"
      />

      <div v-else class="p-4 lg:p-6">
        <Conducta v-if="formularioActivo === 'conducta'" @cerrar="formularioActivo = null" />
        <Egresado v-else-if="formularioActivo === 'egresado'" @cerrar="formularioActivo = null" />
      </div>
    </main>
  </div>
</template>

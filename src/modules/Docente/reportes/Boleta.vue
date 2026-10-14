<script setup>
import ReporteSeccion from "@/components/reportes/ReporteSeccion.vue";

const emit = defineEmits(["cerrar"]);
</script>

<template>
  <ReporteSeccion tipo="notas" ambito="docente" @cerrar="emit('cerrar')" />
</template>

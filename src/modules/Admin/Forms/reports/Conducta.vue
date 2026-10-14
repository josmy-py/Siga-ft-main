<script setup>
import ReporteSeccion from "@/components/reportes/ReporteSeccion.vue";

const emit = defineEmits(["cerrar"]);
</script>

<template>
  <ReporteSeccion tipo="conducta" ambito="director" @cerrar="emit('cerrar')" />
</template>

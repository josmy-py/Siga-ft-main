<script setup>
defineProps({
  tipo: { type: String, default: 'error' }, // error | exito | info
})
</script>

<template>
  <div
    class="mb-5 p-3 text-sm rounded-xl backdrop-blur-md text-center border"
    :class="{
      'text-red-100 bg-red-500/30 border-red-500/40': tipo === 'error',
      'text-green-100 bg-green-500/30 border-green-500/40': tipo === 'exito',
      'text-blue-100 bg-blue-500/30 border-blue-500/40': tipo === 'info',
    }"
  >
    <slot />
  </div>
</template>

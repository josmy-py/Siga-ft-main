<template>
  <div class="relative w-full">
    <div class="relative overflow-hidden">
      <div class="relative">
        <slot name="image"></slot>
      </div>
      <div class="absolute overlay-animate" style="bottom: -1.5rem; left: 50%; transform: translateX(-50%); z-index: 10;">
        <slot name="overlay"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.overlay-animate {
  animation: overlayFadeIn 0.4s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>

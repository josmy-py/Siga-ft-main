<script setup>
// Marco común de las pantallas públicas de acceso (mismo diseño que Login/Register)
import { useRouter } from 'vue-router'

defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
})

const router = useRouter()
</script>

<template>
  <div
    class="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 py-10"
    style="
      background-image: url('https://img.freepik.com/vector-premium/educacion-distancia-linea-casa_108855-1365.jpg?w=2000');
    "
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <button
      type="button"
      @click="router.push('/')"
      class="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
    >
      <i class="pi pi-arrow-left"></i>
      <span class="text-sm font-medium">Volver</span>
    </button>

    <div class="z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10">
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden"
        >
          <img src="/LogoDefi.jpeg" alt="Logo" class="w-full h-full object-cover" />
        </div>

        <h1 class="text-3xl font-bold text-white mt-5 text-center">{{ titulo }}</h1>
        <p v-if="subtitulo" class="text-white/70 text-sm mt-2 text-center">{{ subtitulo }}</p>
      </div>

      <slot />
    </div>
  </div>
</template>

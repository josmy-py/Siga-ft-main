<script setup>
// Campo de formulario con el estilo translúcido de las pantallas de acceso
defineProps({
  etiqueta: { type: String, required: true },
  icono: { type: String, default: 'pi pi-pencil' },
  tipo: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  requerido: { type: Boolean, default: true },
})

const modelo = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <label class="block text-white text-sm font-medium mb-2">{{ etiqueta }}</label>
    <div
      class="flex items-center bg-white/10 border rounded-xl px-4 py-3 backdrop-blur-md"
      :class="error ? 'border-red-400' : 'border-white/20'"
    >
      <i :class="[icono, 'text-white/70 mr-3']"></i>
      <input
        v-model="modelo"
        :type="tipo"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="requerido"
        class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none"
      />
    </div>
    <p v-if="error" class="text-red-200 text-xs mt-1">{{ error }}</p>
  </div>
</template>

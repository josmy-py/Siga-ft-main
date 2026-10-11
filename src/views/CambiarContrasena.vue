<template>
  <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
    <h2 class="text-2xl font-bold text-slate-900 mb-1">Cambiar contraseña</h2>
    <p class="text-slate-500 text-sm mb-6">{{ authStore.user?.email }}</p>

    <div v-if="exito" class="mb-5 p-3 text-sm rounded-lg bg-green-50 text-green-700 border border-green-200">{{ exito }}</div>
    <div v-if="errorMessage" class="mb-5 p-3 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200">{{ errorMessage }}</div>

    <form @submit.prevent="guardar" class="space-y-4">
      <div v-for="campo in campos" :key="campo.clave">
        <label class="block text-sm font-medium text-slate-700 mb-2">{{ campo.etiqueta }}</label>
        <input
          v-model="form[campo.clave]"
          type="password"
          :autocomplete="campo.autocomplete"
          required
          class="w-full h-11 px-4 border rounded-lg focus:outline-none"
          :class="errores[campo.clave] ? 'border-red-400' : 'border-slate-300 focus:border-blue-500'"
        />
        <p v-if="errores[campo.clave]" class="text-red-600 text-xs mt-1">{{ errores[campo.clave] }}</p>
      </div>

      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api, { erroresCampos, mensajeError } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const campos = [
  { clave: 'actual', etiqueta: 'Contraseña actual', autocomplete: 'current-password' },
  { clave: 'password', etiqueta: 'Nueva contraseña (mínimo 8 caracteres, letras y números)', autocomplete: 'new-password' },
  { clave: 'password_confirmation', etiqueta: 'Confirmar nueva contraseña', autocomplete: 'new-password' },
]

const form = reactive({ actual: '', password: '', password_confirmation: '' })
const loading = ref(false)
const exito = ref(null)
const errorMessage = ref(null)
const errores = ref({})

const guardar = async () => {
  loading.value = true
  exito.value = null
  errorMessage.value = null
  errores.value = {}
  try {
    const { data } = await api.put('/auth/contrasena', { ...form })
    // El backend revoca las sesiones anteriores y entrega un token nuevo para esta
    if (data.access_token) authStore.guardarSesion(data)
    exito.value = data.message
  } catch (error) {
    errores.value = erroresCampos(error)
    if (!Object.keys(errores.value).length) errorMessage.value = mensajeError(error)
  } finally {
    form.actual = ''
    form.password = ''
    form.password_confirmation = ''
    loading.value = false
  }
}
</script>

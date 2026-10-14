<template>
  <PantallaAuth
    titulo="Crear cuenta"
    subtitulo="Registro para madres, padres y encargados."
  >
    <template v-if="registrado">
      <AvisoAuth tipo="exito">{{ registrado }}</AvisoAuth>
      <router-link
        :to="{ name: 'login' }"
        class="block text-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl transition"
      >
        Ir a iniciar sesión
      </router-link>
    </template>

    <template v-else>
      <AvisoAuth v-if="errorMessage">{{ errorMessage }}</AvisoAuth>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <CampoAuth v-model="form.email" etiqueta="Correo electrónico" icono="pi pi-envelope" tipo="email" placeholder="correo@ejemplo.com" autocomplete="email" :error="errores.email" />

        <CampoAuth v-model="form.password" etiqueta="Contraseña" icono="pi pi-lock" tipo="password" placeholder="Mínimo 8 caracteres, letras y números" autocomplete="new-password" :error="errores.password" />

        <CampoAuth v-model="form.password_confirmation" etiqueta="Confirmar contraseña" icono="pi pi-lock" tipo="password" placeholder="********" autocomplete="new-password" :error="errores.password_confirmation" />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 border border-blue-600 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? 'Registrando...' : 'Crear cuenta' }}
        </button>

        <p class="text-center text-sm text-white/80">
          ¿Ya tiene cuenta?
          <router-link :to="{ name: 'login' }" class="text-white font-semibold underline">Inicie sesión</router-link>
        </p>
      </form>
    </template>
  </PantallaAuth>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { erroresCampos, mensajeError } from '@/services/api'
import PantallaAuth from '@/components/auth/PantallaAuth.vue'
import CampoAuth from '@/components/auth/CampoAuth.vue'
import AvisoAuth from '@/components/auth/AvisoAuth.vue'

const authStore = useAuthStore()

const form = reactive({ email: '', password: '', password_confirmation: '' })
const loading = ref(false)
const errorMessage = ref(null)
const errores = ref({})
const registrado = ref(null)

// Verificación previa; el backend repite todas las validaciones
const validarLocal = () => {
  const e = {}
  if (!form.email.trim()) e.email = 'El correo es obligatorio.'
  if (form.password.length < 8 || !/[a-zA-Z]/.test(form.password) || !/\d/.test(form.password)) {
    e.password = 'La contraseña debe tener al menos 8 caracteres, con letras y números.'
  }
  if (form.password !== form.password_confirmation) e.password_confirmation = 'La confirmación no coincide.'
  return e
}

const handleRegister = async () => {
  errorMessage.value = null
  errores.value = validarLocal()
  if (Object.keys(errores.value).length) return

  loading.value = true
  try {
    const data = await authStore.register({ ...form })
    registrado.value = data.message
  } catch (error) {
    errores.value = erroresCampos(error)
    if (!Object.keys(errores.value).length) {
      errorMessage.value = mensajeError(error, 'No se pudo crear la cuenta')
    }
  } finally {
    form.password = ''
    form.password_confirmation = ''
    loading.value = false
  }
}
</script>

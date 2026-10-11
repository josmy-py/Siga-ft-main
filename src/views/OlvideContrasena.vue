<template>
  <PantallaAuth titulo="Recuperar contraseña" subtitulo="Le enviaremos un enlace para crear una nueva contraseña">
    <AvisoAuth v-if="enviado" tipo="exito">{{ enviado }}</AvisoAuth>
    <AvisoAuth v-if="errorMessage">{{ errorMessage }}</AvisoAuth>

    <form v-if="!enviado" @submit.prevent="enviar" class="space-y-5">
      <CampoAuth v-model="email" etiqueta="Correo electrónico" icono="pi pi-envelope" tipo="email" placeholder="correo@ejemplo.com" autocomplete="email" :error="errores.email" />

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl transition disabled:opacity-50"
      >
        {{ loading ? 'Enviando...' : 'Enviar enlace' }}
      </button>
    </form>

    <p class="text-center text-sm text-white/80 mt-5">
      <router-link :to="{ name: 'login' }" class="text-white font-semibold underline">Volver a iniciar sesión</router-link>
    </p>
  </PantallaAuth>
</template>

<script setup>
import { ref } from 'vue'
import api, { erroresCampos, mensajeError } from '@/services/api'
import PantallaAuth from '@/components/auth/PantallaAuth.vue'
import CampoAuth from '@/components/auth/CampoAuth.vue'
import AvisoAuth from '@/components/auth/AvisoAuth.vue'

const email = ref('')
const loading = ref(false)
const enviado = ref(null)
const errorMessage = ref(null)
const errores = ref({})

const enviar = async () => {
  loading.value = true
  errorMessage.value = null
  errores.value = {}
  try {
    // La respuesta es la misma exista o no la cuenta
    const { data } = await api.post('/auth/olvide-contrasena', { email: email.value })
    enviado.value = data.message
  } catch (error) {
    errores.value = erroresCampos(error)
    if (!Object.keys(errores.value).length) errorMessage.value = mensajeError(error)
  } finally {
    loading.value = false
  }
}
</script>

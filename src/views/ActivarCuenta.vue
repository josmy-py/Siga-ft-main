<template>
  <PantallaAuth titulo="Activar cuenta">
    <AvisoAuth v-if="estado === 'cargando'" tipo="info">Activando su cuenta...</AvisoAuth>
    <AvisoAuth v-else-if="estado === 'exito'" tipo="exito">{{ mensaje }}</AvisoAuth>
    <AvisoAuth v-else>{{ mensaje }}</AvisoAuth>

    <div v-if="estado !== 'cargando'" class="space-y-3">
      <router-link
        :to="{ name: 'login' }"
        class="block text-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl transition"
      >
        Ir a iniciar sesión
      </router-link>
      <p v-if="estado === 'error'" class="text-white/80 text-sm text-center">
        Si el enlace venció, inicie sesión con su correo y contraseña y use la opción «Reenviar enlace de activación».
      </p>
    </div>
  </PantallaAuth>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_URL } from '@/services/api'
import PantallaAuth from '@/components/auth/PantallaAuth.vue'
import AvisoAuth from '@/components/auth/AvisoAuth.vue'

const route = useRoute()
const estado = ref('cargando')
const mensaje = ref('')

// El correo trae la URL firmada del backend. Solo se acepta si apunta a la
// ruta de activación de nuestra API, y se llama sin token de sesión.
const enlaceValido = (enlace) => {
  try {
    const url = new URL(enlace)
    const api = new URL(API_URL)
    return url.origin === api.origin && url.pathname.startsWith(`${api.pathname}/auth/activar/`)
  } catch {
    return false
  }
}

onMounted(async () => {
  const enlace = typeof route.query.enlace === 'string' ? route.query.enlace : ''

  if (!enlaceValido(enlace)) {
    estado.value = 'error'
    mensaje.value = 'El enlace de activación no es válido.'
    return
  }

  try {
    const { data } = await axios.get(enlace, { headers: { Accept: 'application/json' } })
    estado.value = 'exito'
    mensaje.value = data.message
  } catch (error) {
    estado.value = 'error'
    mensaje.value = error.response?.data?.message || 'No se pudo activar la cuenta. Intente nuevamente.'
  }
})
</script>

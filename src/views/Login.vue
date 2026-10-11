<template>
  <PantallaAuth titulo="Bienvenido" subtitulo="Inicia sesión para continuar">
    <AvisoAuth v-if="avisoMotivo" tipo="info">{{ avisoMotivo }}</AvisoAuth>
    <AvisoAuth v-if="errorMessage">{{ errorMessage }}</AvisoAuth>
    <AvisoAuth v-if="mensajeReenvio" tipo="exito">{{ mensajeReenvio }}</AvisoAuth>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <CampoAuth
        v-model="email"
        etiqueta="Email"
        icono="pi pi-user"
        tipo="email"
        placeholder="Ingrese su email"
        autocomplete="username"
        :error="errores.email"
      />

      <CampoAuth
        v-model="password"
        etiqueta="Contraseña"
        icono="pi pi-lock"
        tipo="password"
        placeholder="********"
        autocomplete="current-password"
        :error="errores.password"
      />

      <div class="text-right -mt-2">
        <router-link :to="{ name: 'olvide-contrasena' }" class="text-sm text-white/80 hover:text-white underline">
          ¿Olvidó su contraseña?
        </router-link>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-500 border-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
      >
        {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
      </button>

      <button
        v-if="cuentaPendiente"
        type="button"
        :disabled="reenviando"
        @click="reenviarActivacion"
        class="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium py-2.5 rounded-xl transition disabled:opacity-50"
      >
        {{ reenviando ? 'Enviando...' : 'Reenviar enlace de activación' }}
      </button>

      <p class="text-center text-sm text-white/80">
        ¿Es encargado y no tiene cuenta?
        <router-link :to="{ name: 'register' }" class="text-white font-semibold underline">Regístrese</router-link>
      </p>
    </form>
  </PantallaAuth>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api, { erroresCampos, mensajeError } from '@/services/api'
import PantallaAuth from '@/components/auth/PantallaAuth.vue'
import CampoAuth from '@/components/auth/CampoAuth.vue'
import AvisoAuth from '@/components/auth/AvisoAuth.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref(null)
const errores = ref({})
const cuentaPendiente = ref(false)
const reenviando = ref(false)
const mensajeReenvio = ref(null)

const MOTIVOS = {
  expirada: 'Su sesión expiró. Inicie sesión nuevamente.',
  cuenta_inactiva: 'Su cuenta fue desactivada. Comuníquese con la dirección del centro escolar.',
  cuenta_pendiente: 'Su cuenta aún no está activada.',
  sesion_revocada: 'La contraseña de su cuenta cambió. Inicie sesión con la contraseña nueva.',
}
const avisoMotivo = computed(() => MOTIVOS[route.query.motivo] ?? null)

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = null
  errores.value = {}
  cuentaPendiente.value = false
  mensajeReenvio.value = null

  try {
    await authStore.login({ email: email.value, password: password.value })

    // Solo se respeta un destino interno; el guard comprueba que el rol lo permita
    const destino = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') && !route.query.redirect.startsWith('//')
      ? route.query.redirect
      : authStore.rutaInicio

    await router.push(destino)
  } catch (error) {
    errores.value = erroresCampos(error)
    cuentaPendiente.value = error.response?.data?.codigo === 'cuenta_pendiente'
    if (!Object.keys(errores.value).length) {
      errorMessage.value = mensajeError(error, 'Error al iniciar sesión')
    }
  } finally {
    password.value = ''
    loading.value = false
  }
}

const reenviarActivacion = async () => {
  reenviando.value = true
  try {
    const { data } = await api.post('/auth/reenviar-activacion', { email: email.value })
    mensajeReenvio.value = data.message
    errorMessage.value = null
  } catch (error) {
    errorMessage.value = mensajeError(error, 'No se pudo reenviar el enlace')
  } finally {
    reenviando.value = false
  }
}
</script>

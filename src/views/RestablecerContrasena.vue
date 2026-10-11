<template>
  <PantallaAuth
    :titulo="inicial ? 'Definir contraseña' : 'Nueva contraseña'"
    :subtitulo="inicial ? 'Cree la contraseña de su cuenta para activarla' : 'Ingrese su nueva contraseña'"
  >
    <template v-if="listo">
      <AvisoAuth tipo="exito">{{ listo }}</AvisoAuth>
      <router-link
        :to="{ name: 'login' }"
        class="block text-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl transition"
      >
        Ir a iniciar sesión
      </router-link>
    </template>

    <template v-else>
      <AvisoAuth v-if="!token || !email">El enlace no es válido. Solicite uno nuevo.</AvisoAuth>
      <AvisoAuth v-if="errorMessage">{{ errorMessage }}</AvisoAuth>

      <form v-if="token && email" @submit.prevent="guardar" class="space-y-5">
        <p class="text-white/80 text-sm text-center">Cuenta: <strong>{{ email }}</strong></p>

        <CampoAuth v-model="password" etiqueta="Nueva contraseña" icono="pi pi-lock" tipo="password" placeholder="Mínimo 8 caracteres, letras y números" autocomplete="new-password" :error="errores.password" />
        <CampoAuth v-model="confirmacion" etiqueta="Confirmar contraseña" icono="pi pi-lock" tipo="password" placeholder="********" autocomplete="new-password" :error="errores.password_confirmation" />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl transition disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar contraseña' }}
        </button>
      </form>

      <p class="text-center text-sm text-white/80 mt-5">
        <router-link :to="{ name: 'olvide-contrasena' }" class="text-white font-semibold underline">Solicitar un enlace nuevo</router-link>
      </p>
    </template>
  </PantallaAuth>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import api, { erroresCampos, mensajeError } from '@/services/api'
import PantallaAuth from '@/components/auth/PantallaAuth.vue'
import CampoAuth from '@/components/auth/CampoAuth.vue'
import AvisoAuth from '@/components/auth/AvisoAuth.vue'

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const inicial = computed(() => route.query.inicial === '1')

const password = ref('')
const confirmacion = ref('')
const loading = ref(false)
const listo = ref(null)
const errorMessage = ref(null)
const errores = ref({})

const guardar = async () => {
  errorMessage.value = null
  errores.value = {}
  if (password.value !== confirmacion.value) {
    errores.value = { password_confirmation: 'La confirmación no coincide.' }
    return
  }

  loading.value = true
  try {
    const { data } = await api.post('/auth/restablecer-contrasena', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmacion.value,
    })
    listo.value = data.message
  } catch (error) {
    const campos = erroresCampos(error)
    errores.value = campos
    // El token inválido o vencido se muestra como aviso general
    errorMessage.value = campos.token || campos.email || (!Object.keys(campos).length ? mensajeError(error) : null)
  } finally {
    password.value = ''
    confirmacion.value = ''
    loading.value = false
  }
}
</script>

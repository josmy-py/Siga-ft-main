import { defineStore } from 'pinia'
import api, { solicitarRenovacion } from '@/services/api'
import router from '@/router'
import { RUTA_INICIO_POR_ROL, etiquetaRol } from '@/constants/roles'

/**
 * Sesión única de la aplicación (sustituye a stores/user.js).
 * Guarda el token JWT, su vencimiento y los datos de la cuenta que devuelve
 * el backend (nombre, dui, email, estado y rol). Nunca guarda contraseñas.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    expiraEn: null, // marca de tiempo (ms) en que vence el token
    user: null,
    verificado: false, // true cuando /auth/me confirmó la sesión en esta carga
  }),

  getters: {
    tokenVigente: (state) => !!state.token && !!state.expiraEn && Date.now() < state.expiraEn,
    autenticado() {
      return this.tokenVigente && !!this.user
    },
    rol: (state) => state.user?.rol ?? null,
    etiquetaRol: (state) => etiquetaRol(state.user?.rol),
    rutaInicio: (state) => ({ name: RUTA_INICIO_POR_ROL[state.user?.rol] ?? 'login' }),
  },

  actions: {
    guardarSesion({ access_token, expires_in, user }) {
      this.token = access_token
      this.expiraEn = Date.now() + Number(expires_in) * 1000
      if (user) this.user = user
      this.verificado = true
    },

    limpiarSesion() {
      this.token = null
      this.expiraEn = null
      this.user = null
      this.verificado = false
    },

    async login(credenciales) {
      const { data } = await api.post('/auth/login', credenciales)
      this.guardarSesion(data)
      return data.user
    },

    // Registro público: crea la cuenta pendiente; no inicia sesión
    async register(datos) {
      const { data } = await api.post('/auth/register', datos)
      return data
    },

    // Confirma la sesión con el backend y actualiza nombre, estado y rol
    async me() {
      const { data } = await api.get('/auth/me')
      this.user = data.user
      this.verificado = true
      return data.user
    },

    // Renueva un token todavía vigente; si falla, la sesión termina
    async refresh() {
      const data = await solicitarRenovacion()
      return data.user
    },

    async logout({ llamarApi = true, motivo = null } = {}) {
      if (llamarApi && this.tokenVigente) {
        try {
          await api.post('/auth/logout')
        } catch {
          // La sesión local se cierra igual
        }
      }

      this.limpiarSesion()

      if (router.currentRoute.value.name !== 'login') {
        await router.push({ name: 'login', query: motivo ? { motivo } : {} })
      }
    },
  },

  persist: {
    pick: ['token', 'expiraEn', 'user'],
  },
})

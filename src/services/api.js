import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

// Rutas públicas o de sesión: nunca disparan una renovación automática
const SIN_RENOVACION = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/reenviar-activacion',
  '/auth/olvide-contrasena',
  '/auth/restablecer-contrasena',
]

const RENOVAR_ANTES_MS = 5 * 60 * 1000

const esRutaSinRenovacion = (url = '') => SIN_RENOVACION.some((ruta) => url.startsWith(ruta))

// Una sola renovación compartida aunque fallen varias peticiones a la vez
let renovacionEnCurso = null

export const solicitarRenovacion = () => {
  const auth = useAuthStore()

  if (!renovacionEnCurso) {
    renovacionEnCurso = axios
      .post(`${API_URL}/auth/refresh`, null, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${auth.token}` },
      })
      .then(({ data }) => {
        auth.guardarSesion(data)
        return data
      })
      .finally(() => {
        renovacionEnCurso = null
      })
  }

  return renovacionEnCurso
}

api.interceptors.request.use(async (config) => {
  const auth = useAuthStore()

  if (!auth.token) return config

  // Token vencido: no se envía; la sesión termina (el backend no renueva tokens vencidos)
  if (!auth.tokenVigente) {
    if (!esRutaSinRenovacion(config.url)) {
      auth.logout({ llamarApi: false, motivo: 'expirada' })
      return Promise.reject(new axios.Cancel('Sesión expirada'))
    }
    return config
  }

  // Renovación preventiva cuando faltan pocos minutos para el vencimiento
  if (!esRutaSinRenovacion(config.url) && auth.expiraEn - Date.now() < RENOVAR_ANTES_MS) {
    try {
      await solicitarRenovacion()
    } catch {
      auth.logout({ llamarApi: false, motivo: 'expirada' })
      return Promise.reject(new axios.Cancel('Sesión expirada'))
    }
  }

  config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const { response, config } = error

    if (!response || !config) return Promise.reject(error)

    // 401: un único intento de renovación por petición; si falla, se cierra la sesión
    if (response.status === 401 && auth.token && !esRutaSinRenovacion(config.url)) {
      // Contraseña cambiada en otra sesión: renovar no sirve, se cierra la sesión
      if (response.data?.codigo === 'sesion_revocada') {
        auth.logout({ llamarApi: false, motivo: 'sesion_revocada' })
        return Promise.reject(error)
      }

      if (!config._reintentada && auth.tokenVigente) {
        config._reintentada = true
        try {
          await solicitarRenovacion()
          config.headers.Authorization = `Bearer ${auth.token}`
          return api(config)
        } catch {
          // continúa al cierre de sesión
        }
      }

      auth.logout({ llamarApi: false, motivo: 'expirada' })
      return Promise.reject(error)
    }

    // 403 por cuenta desactivada o pendiente: la sesión ya no es válida.
    // Cualquier otro 403 es falta de permiso y nunca dispara una renovación.
    const codigo = response.data?.codigo
    if (response.status === 403 && auth.token && (codigo === 'cuenta_inactiva' || codigo === 'cuenta_pendiente')) {
      auth.logout({ llamarApi: false, motivo: codigo })
    }

    return Promise.reject(error)
  },
)

// Mensaje legible de un error de la API (para alertas)
export const mensajeError = (error, porDefecto = 'Ocurrió un error. Intente nuevamente.') => {
  if (axios.isCancel(error)) return 'Su sesión expiró. Inicie sesión nuevamente.'
  if (!error?.response) return 'No se pudo conectar con el servidor.'
  if (error.response.status === 403 && !error.response.data?.codigo) return 'No tiene permiso para realizar esta acción.'
  if (error.response.status === 429) return 'Demasiados intentos. Espere un momento e inténtelo de nuevo.'
  return error.response.data?.message || porDefecto
}

// Errores por campo de una respuesta 422 ({ campo: 'primer mensaje' })
export const erroresCampos = (error) => {
  const errores = error?.response?.status === 422 ? error.response.data?.errors ?? {} : {}
  return Object.fromEntries(Object.entries(errores).map(([campo, mensajes]) => [campo, mensajes[0]]))
}

export default api

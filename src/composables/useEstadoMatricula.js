import { ref } from 'vue'
import { familiaService } from '@/services/familiaService'

// Estado de matrícula de la cuenta ENCARGADO en el año actual. Decide el menú:
// 'pendiente' o 'sin_matricula' -> Inicio, Registro de Estudiante, Registro de Padres, Solicitud y Perfil;
// 'aprobada' -> Inicio, Perfil, Libreta de Notas y Asignaturas. Compartido por el menú y las guardas.
const estado = ref(null)
let consulta = null

export const RUTAS_APROBADA = ['inicio-cliente', 'perfil-cliente', 'boleta-cliente', 'asignaturas-cliente', 'contrasena-cliente']

export function useEstadoMatricula() {
  const cargar = async ({ forzar = false } = {}) => {
    if (estado.value && !forzar) return estado.value
    consulta ??= familiaService
      .perfil()
      .then((perfil) => (estado.value = perfil.estado_matricula ?? 'sin_matricula'))
      .catch(() => (estado.value = 'sin_matricula'))
      .finally(() => (consulta = null))
    return consulta
  }

  const limpiar = () => {
    estado.value = null
  }

  return { estado, cargar, limpiar }
}

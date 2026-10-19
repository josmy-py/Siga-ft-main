import { onMounted, ref } from "vue";
import { anioLectivoService } from "@/services/calendarioService";

// Especialidades y secciones no se crean, modifican ni eliminan mientras haya un
// año lectivo activo (pedido de Josmy, 19/10/2026). La API también lo impide.
export function useAnioActivo() {
  const anioActivo = ref(null);

  const cargarAnioActivo = async () => {
    try {
      anioActivo.value = (await anioLectivoService.actual()).anio_lectivo ?? null;
    } catch {
      anioActivo.value = null;
    }
  };

  onMounted(cargarAnioActivo);

  return { anioActivo, cargarAnioActivo };
}

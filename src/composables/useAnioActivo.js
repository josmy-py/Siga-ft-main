import { onMounted, ref } from "vue";
import { anioLectivoService } from "@/services/calendarioService";

// Año lectivo activo. Trae "comenzado": las especialidades no se crean, modifican
// ni eliminan cuando el año activo ya comenzó (pedido de Josmy, 20/10/2026). La API también lo impide.
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

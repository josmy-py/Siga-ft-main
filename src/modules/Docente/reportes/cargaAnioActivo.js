import { asignacionService } from "@/services/asignacionService";

// Carga académica del docente para los reportes (pedido de Josmy, 23/10/2026):
// solo del año lectivo activo. Si no hay un año activo (la carga cae en el último
// año inactivo), no hay secciones ni año para los reportes.
export async function cargaDelAnioActivo() {
  const datos = await asignacionService.miCarga();
  const activo = datos.anio_lectivo?.estado === "activo";
  return { ...datos, anio_lectivo: activo ? datos.anio_lectivo : null, secciones: activo ? (datos.secciones ?? []) : [] };
}

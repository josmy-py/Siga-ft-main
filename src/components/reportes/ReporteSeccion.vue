<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { reporteService } from "../../services/reporteService";
import { periodosDelGrado } from "@/services/nivelAcademico";

// M12: Reporte de notas o de conducta de una sección en un periodo.
// ambito "docente" (Libreta) o "director" (Generar reportes académicos).
const props = defineProps({
  tipo: { type: String, required: true }, // "notas" | "conducta"
  ambito: { type: String, required: true }, // "docente" | "director"
});
const emit = defineEmits(["cerrar"]);

const secciones = ref([]);
const seccionId = ref("");
const periodos = ref([]);
const periodoId = ref("");
const reporte = ref(null);
const cargando = ref(true);
const error = ref("");

const titulo = computed(() => (props.tipo === "notas" ? "Reporte de notas" : "Reporte de conducta"));
const seccionActual = computed(() => secciones.value.find((s) => String(s.id) === String(seccionId.value)));
const periodoActual = computed(() => periodos.value.find((p) => String(p.id) === String(periodoId.value)));

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;
const nota = (v) => (v === null || v === undefined ? "—" : Number(v).toFixed(2));

onMounted(async () => {
  try {
    secciones.value = await reporteService.secciones(props.ambito);
    seccionId.value = secciones.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudieron cargar las secciones.");
  } finally {
    cargando.value = false;
  }
});

watch(seccionId, async () => {
  periodos.value = [];
  periodoId.value = "";
  reporte.value = null;
  if (!seccionActual.value) return;
  try {
    // Solo los periodos del nivel académico de la sección
    const grado = seccionActual.value.grado;
    periodos.value = periodosDelGrado(await reporteService.periodos(seccionActual.value.anio_lectivo_id), grado?.nombre ?? grado);
    periodoId.value = periodos.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudieron cargar los periodos.");
  }
});

watch(periodoId, async () => {
  reporte.value = null;
  if (!seccionId.value || !periodoId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    reporte.value = await reporteService[props.tipo](props.ambito, seccionId.value, periodoId.value);
  } catch (e) {
    error.value = mensaje(e, "No se pudo generar el reporte.");
  } finally {
    cargando.value = false;
  }
});

</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
      <h2 class="text-xl font-semibold text-gray-800">{{ titulo }}</h2>
      <div class="flex gap-2">
        <button class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200" @click="emit('cerrar')">Volver</button>
      </div>
    </div>

    <div class="flex flex-wrap items-end gap-4 mb-6 print:hidden">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sección</label>
        <select v-model="seccionId" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option v-if="!secciones.length" value="">Sin secciones</option>
          <option v-for="s in secciones" :key="s.id" :value="s.id">{{ s.grado }} {{ s.nombre }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
        <select v-model="periodoId" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option v-if="!periodos.length" value="">Sin periodos</option>
          <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
        </select>
      </div>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
    <p v-if="cargando" class="text-sm text-gray-500"><i class="pi pi-spin pi-spinner mr-2"></i>Cargando...</p>

    <div v-else-if="reporte">
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-800">{{ titulo }}</h3>
        <p class="text-sm text-gray-600">
          {{ seccionActual?.grado }} {{ seccionActual?.nombre }} · {{ periodoActual?.nombre }}
        </p>
      </div>

      <p v-if="!reporte.estudiantes.length" class="text-sm text-gray-500">
        No hay estudiantes con matrícula aprobada en esta sección.
      </p>

      <div v-else class="overflow-x-auto">
        <table v-if="tipo === 'notas'" class="min-w-full border border-gray-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left">Estudiante</th>
              <th v-for="m in reporte.materias" :key="m.asignacion_id" class="px-4 py-2 text-center">{{ m.nombre }}</th>
              <th class="px-4 py-2 text-center">Promedio</th>
              <th class="px-4 py-2 text-center">Nota final</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in reporte.estudiantes" :key="e.matricula_id" class="border-t">
              <td class="px-4 py-2 font-medium">{{ e.estudiante?.nombre }}</td>
              <td v-for="m in reporte.materias" :key="m.asignacion_id" class="px-4 py-2 text-center">
                {{ nota(e.promedios[m.asignacion_id]) }}
              </td>
              <td class="px-4 py-2 text-center font-semibold">{{ nota(e.promedio) }}</td>
              <td class="px-4 py-2 text-center">
                <span v-if="e.nota_final">{{ nota(e.nota_final.promedio_anual) }} ({{ e.nota_final.estado }})</span>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else class="min-w-full border border-gray-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left">Estudiante</th>
              <th class="px-4 py-2 text-left">Observación</th>
              <th class="px-4 py-2 text-center">Valoración</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in reporte.estudiantes" :key="e.matricula_id" class="border-t">
              <td class="px-4 py-2 font-medium">{{ e.estudiante?.nombre }}</td>
              <td class="px-4 py-2">{{ e.conducta?.descripcion ?? "Sin registrar" }}</td>
              <td class="px-4 py-2 text-center">{{ e.conducta?.valoracion ?? "—" }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="tipo === 'notas'" class="mt-3 text-xs text-gray-500">
          Cada materia muestra el promedio de su boleta del periodo; "—" si el docente aún no genera la libreta.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { estudianteService } from "../../services/estudianteService";
import { consultaService } from "../../services/consultaService";

// Diagrama: SIGA Encargado > Consultar estudiante > Consultar notas y Consultar conducta
const vistaActiva = ref("calificaciones");

const hijos = ref([]);
const hijoSeleccionadoId = ref("");
const matriculaId = ref("");
const periodoId = ref("");

const notas = ref(null);
const conducta = ref(null);
const cargando = ref(true);
const error = ref("");

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;
const nota = (v) => (v === null || v === undefined ? "—" : Number(v).toFixed(2));

const matriculas = computed(() => notas.value?.matriculas ?? []);
const periodos = computed(() => notas.value?.periodos ?? []);
const materias = computed(() =>
  (notas.value?.materias ?? []).map((m) => ({
    ...m,
    periodo: m.periodos.find((p) => String(p.periodo_escolar_id) === String(periodoId.value)),
  }))
);

const cargar = async () => {
  notas.value = null;
  conducta.value = null;
  if (!hijoSeleccionadoId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    const id = matriculaId.value || null;
    [notas.value, conducta.value] = await Promise.all([
      consultaService.notas(hijoSeleccionadoId.value, id),
      consultaService.conducta(hijoSeleccionadoId.value, id),
    ]);
    matriculaId.value = notas.value.matricula?.id ?? "";
    if (!periodos.value.some((p) => String(p.id) === String(periodoId.value))) {
      periodoId.value = periodos.value[0]?.id ?? "";
    }
  } catch (e) {
    error.value = mensaje(e, "No se pudieron consultar las notas.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    // Solo los estudiantes de la cuenta con matrícula aprobada (los demás no tienen notas)
    hijos.value = await estudianteService.listar({ con_matricula_aprobada: 1 });
    hijoSeleccionadoId.value = hijos.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudieron cargar tus estudiantes.");
  } finally {
    cargando.value = false;
  }
});

watch(hijoSeleccionadoId, () => {
  matriculaId.value = "";
  cargar();
});

const cambiarMatricula = () => cargar();

const getConductaClass = (valoracion) =>
  ({
    Excelente: "bg-green-100 text-green-700",
    Bueno: "bg-blue-100 text-blue-700",
    Malo: "bg-yellow-100 text-yellow-700",
    Deficiente: "bg-red-100 text-red-700",
  })[valoracion] || "bg-gray-100 text-gray-700";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">
      

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1">
        <!-- PESTAÑAS Y SELECTORES -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <!-- Lado Izquierdo: Pestañas -->
          <div class="flex gap-3 w-full lg:w-auto">
            <button
              @click="vistaActiva = 'calificaciones'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border',
                vistaActiva === 'calificaciones'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400',
              ]"
            >
              <i class="pi pi-book"></i> Calificaciones
            </button>

            <button
              @click="vistaActiva = 'conducta'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border',
                vistaActiva === 'conducta'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400',
              ]"
            >
              <i class="pi pi-users"></i> Conducta
            </button>
          </div>

          <!-- Lado Derecho: Selector de Estudiante, año y periodo -->
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div class="relative w-full sm:w-72">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                <i class="pi pi-user text-sm"></i>
              </div>
              <select
                v-model="hijoSeleccionadoId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer appearance-none transition"
              >
                <option v-if="!hijos.length" value="">Sin estudiantes</option>
                <option v-for="hijo in hijos" :key="hijo.id" :value="hijo.id">{{ hijo.nombre }}</option>
              </select>
              <i
                class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"
              ></i>
            </div>

            <select
              v-if="matriculas.length > 1"
              v-model="matriculaId"
              class="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold rounded-xl px-4 py-2 bg-white shadow-sm text-sm"
              @change="cambiarMatricula"
            >
              <option v-for="m in matriculas" :key="m.id" :value="m.id">
                {{ m.anio }} · {{ m.grado }} {{ m.seccion }}
              </option>
            </select>

            <select
              v-if="vistaActiva === 'calificaciones'"
              v-model="periodoId"
              class="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer text-sm"
            >
              <option v-if="!periodos.length" value="">Sin periodos</option>
              <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
            </select>
          </div>
        </div>

        <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
        <p v-if="cargando" class="text-sm text-gray-500"><i class="pi pi-spin pi-spinner mr-2"></i>Cargando...</p>
        <p v-else-if="notas && !notas.matricula" class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {{ notas.estudiante?.nombre }} aún no tiene una matrícula aprobada: no hay notas ni conducta que consultar.
        </p>

        <!-- TABLA 1: CALIFICACIONES -->
        <div v-if="!cargando && notas?.matricula && vistaActiva === 'calificaciones'" class="animate-fade-in mb-8">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <i class="pi pi-chart-bar text-blue-600"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800">Calificaciones por Asignatura</h2>
              </div>
              <p v-if="notas.nota_final" class="text-sm font-semibold text-gray-700">
                Nota final del año: {{ nota(notas.nota_final.promedio_anual) }}
                <span
                  class="ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase"
                  :class="notas.nota_final.estado === 'Aprobada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ notas.nota_final.estado }}
                </span>
              </p>
            </div>

            <p v-if="!materias.length" class="p-6 text-sm text-gray-500">La sección aún no tiene materias asignadas.</p>
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Asignatura</th>
                    <th class="px-6 py-4 text-left">Evaluaciones</th>
                    <th class="px-6 py-4 text-center">Promedio del periodo</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="m in materias" :key="m.asignacion_id" class="hover:bg-blue-50/50 transition">
                    <td class="px-6 py-4">
                      <p class="font-bold text-gray-800">{{ m.asignatura }}</p>
                      <p class="text-xs text-gray-500">{{ m.docente }}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <span v-if="!m.periodo?.evaluaciones.length">Sin evaluaciones</span>
                      <span v-for="(ev, i) in m.periodo?.evaluaciones ?? []" :key="i" class="mr-4 inline-block">
                        {{ ev.nombre }} ({{ ev.porcentaje }}%): <b>{{ nota(ev.nota) }}</b>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center font-bold text-blue-600 text-lg">
                      {{ nota(m.periodo?.promedio) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="px-6 py-3 text-xs text-gray-500">
                El promedio aparece cuando el docente genera la libreta del periodo.
              </p>
            </div>
          </div>
        </div>

        <!-- TABLA 2: CONDUCTA -->
        <div v-if="!cargando && notas?.matricula && vistaActiva === 'conducta'" class="animate-fade-in mb-6">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i class="pi pi-star text-blue-600"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Evaluación de Conducta</h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Periodo</th>
                    <th class="px-6 py-4 text-left">Observación</th>
                    <th class="px-6 py-4 text-center w-48">Valoración</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="fila in conducta?.periodos ?? []" :key="fila.periodo.id" class="hover:bg-blue-50/50 transition">
                    <td class="px-6 py-5 font-semibold text-gray-800">{{ fila.periodo.nombre }}</td>
                    <td class="px-6 py-5 font-medium text-gray-700">
                      {{ fila.conducta?.descripcion ?? "Sin registrar" }}
                    </td>
                    <td class="px-6 py-5 text-center">
                      <span
                        class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                        :class="getConductaClass(fila.conducta?.valoracion)"
                      >
                        {{ fila.conducta?.valoracion ?? "—" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

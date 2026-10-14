<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { asignacionService } from "../../services/asignacionService";
import { notasService } from "../../services/notasService";

const route = useRoute();

const asignaciones = ref([]);
const asignacionId = ref("");
const periodos = ref([]);
const periodoId = ref("");

// Por evaluación: { evaluacion, notas: { [matricula_id]: nota }, originales }
const evaluaciones = ref([]);
const estudiantes = ref([]);
const resumen = ref({ porcentaje_usado: 0, porcentaje_disponible: 100, editable: false });

const cargando = ref(true);
const guardando = ref(false);
const error = ref("");
const aviso = ref("");

const nueva = ref({ nombre: "", porcentaje: "" });

// M9 Libreta: boletas de la materia en el periodo
const libreta = ref(null);
const generando = ref(false);
const boletaDe = (matriculaId) =>
  libreta.value?.estudiantes.find((e) => e.matricula_id === matriculaId)?.boleta ?? null;
const erroresNueva = ref({});

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

const etiqueta = (a) =>
  `${a.asignatura?.nombre ?? "Materia"} · ${a.seccion?.grado?.nombre ?? ""} ${a.seccion?.nombre ?? ""}`.trim();

const asignacionActual = computed(() =>
  asignaciones.value.find((a) => String(a.id) === String(asignacionId.value))
);

const vacia = (v) => v === "" || v === null || v === undefined;

const notaInvalida = (v) =>
  !vacia(v) && (Number.isNaN(Number(v)) || Number(v) < 0 || Number(v) > 10 || !/^\d+(\.\d{1,2})?$/.test(String(v)));

// Suma de nota × porcentaje de las evaluaciones con nota, sobre 10
const acumulado = (matriculaId) => {
  let total = 0;
  let hay = false;
  for (const fila of evaluaciones.value) {
    const v = fila.notas[matriculaId];
    if (!vacia(v) && !notaInvalida(v)) {
      total += (Number(v) * Number(fila.evaluacion.porcentaje)) / 100;
      hay = true;
    }
  }
  return hay ? total.toFixed(2) : "—";
};

const cambios = computed(() =>
  evaluaciones.value
    .map((fila) => ({
      fila,
      notas: Object.entries(fila.notas)
        .filter(([id, v]) => !vacia(v) && String(v) !== String(fila.originales[id] ?? ""))
        .map(([id, v]) => ({ matricula_id: Number(id), nota: Number(v) })),
    }))
    .filter((c) => c.notas.length)
);

const hayInvalidas = computed(() =>
  evaluaciones.value.some((fila) => Object.values(fila.notas).some(notaInvalida))
);

const cargarAsignacion = async () => {
  periodos.value = [];
  periodoId.value = "";
  estudiantes.value = [];
  evaluaciones.value = [];
  if (!asignacionId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    const data = await notasService.estudiantes(asignacionId.value);
    periodos.value = data.periodos;
    estudiantes.value = data.estudiantes;
    periodoId.value = periodos.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudo cargar la asignatura.");
  } finally {
    cargando.value = false;
  }
};

const cargarEvaluaciones = async () => {
  evaluaciones.value = [];
  libreta.value = null;
  aviso.value = "";
  if (!asignacionId.value || !periodoId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    const data = await notasService.evaluaciones(asignacionId.value, periodoId.value);
    resumen.value = data;
    const detalles = await Promise.all(data.evaluaciones.map((ev) => notasService.calificaciones(ev.id)));
    evaluaciones.value = detalles.map((d, i) => {
      const originales = Object.fromEntries(d.estudiantes.map((e) => [e.matricula_id, e.nota ?? ""]));
      return { evaluacion: data.evaluaciones[i], notas: { ...originales }, originales };
    });
    libreta.value = await notasService.libreta(asignacionId.value, periodoId.value);
  } catch (e) {
    error.value = mensaje(e, "No se pudieron cargar las evaluaciones.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    const carga = await asignacionService.miCarga();
    asignaciones.value = carga.asignaciones ?? [];
    const pedida = asignaciones.value.find((a) => String(a.id) === String(route.query.asignacion));
    asignacionId.value = (pedida ?? asignaciones.value[0])?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudo cargar tu carga académica.");
  } finally {
    cargando.value = false;
  }
});

watch(asignacionId, cargarAsignacion);
watch(periodoId, cargarEvaluaciones);

// Evaluacion.crear() con validarDisponibilidad() en la API
const crearEvaluacion = async () => {
  erroresNueva.value = {};
  aviso.value = "";
  try {
    await notasService.crearEvaluacion(asignacionId.value, {
      nombre: nueva.value.nombre,
      porcentaje: nueva.value.porcentaje,
      periodo_escolar_id: periodoId.value,
    });
    nueva.value = { nombre: "", porcentaje: "" };
    await cargarEvaluaciones();
    aviso.value = "Evaluación creada.";
  } catch (e) {
    erroresNueva.value = e.response?.data?.errors ?? {};
    if (!Object.keys(erroresNueva.value).length) error.value = mensaje(e, "No se pudo crear la evaluación.");
  }
};

const eliminarEvaluacion = async (ev) => {
  if (!confirm(`¿Eliminar la evaluación "${ev.nombre}"?`)) return;
  aviso.value = "";
  try {
    await notasService.eliminarEvaluacion(ev.id);
    await cargarEvaluaciones();
    aviso.value = "Evaluación eliminada.";
  } catch (e) {
    error.value = mensaje(e, "No se pudo eliminar la evaluación.");
  }
};

// Boleta.crear() / actualizar(); la nota final del año se calcula sola
const generarLibreta = async () => {
  generando.value = true;
  error.value = "";
  aviso.value = "";
  try {
    const r = await notasService.generarLibreta(asignacionId.value, periodoId.value);
    await cargarEvaluaciones();
    aviso.value = `Libreta generada: ${r.creadas} boletas nuevas, ${r.actualizadas} actualizadas.`;
  } catch (e) {
    error.value = e.response?.data?.errors?.libreta?.[0] ?? mensaje(e, "No se pudo generar la libreta.");
  } finally {
    generando.value = false;
  }
};

// Calificacion.registrar() / actualizar(nota) de cada evaluación modificada
const guardar = async () => {
  if (hayInvalidas.value || !cambios.value.length) return;
  guardando.value = true;
  error.value = "";
  aviso.value = "";
  let registradas = 0;
  let actualizadas = 0;
  try {
    for (const c of cambios.value) {
      const r = await notasService.guardarCalificaciones(c.fila.evaluacion.id, c.notas);
      registradas += r.registradas;
      actualizadas += r.actualizadas;
    }
    await cargarEvaluaciones();
    aviso.value = `Notas guardadas: ${registradas} registradas, ${actualizadas} actualizadas.`;
  } catch (e) {
    error.value = mensaje(e, "No se pudieron guardar las notas.");
  } finally {
    guardando.value = false;
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <div class="flex items-end gap-4 flex-wrap">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Asignatura y sección </label>
              <select
                v-model="asignacionId"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option v-if="!asignaciones.length" value="">Sin asignaturas</option>
                <option v-for="a in asignaciones" :key="a.id" :value="a.id">{{ etiqueta(a) }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Periodo </label>
              <select
                v-model="periodoId"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option v-if="!periodos.length" value="">Sin periodos</option>
                <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
            </div>
          </div>
        </section>

        <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
        <p v-if="aviso" class="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{{ aviso }}</p>
        <p
          v-if="periodoId && !cargando && !resumen.editable"
          class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          El año lectivo de este periodo no está activo: las notas solo se pueden consultar.
        </p>

        <!-- Evaluaciones del periodo -->
        <div v-if="periodoId" class="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Evaluaciones</h2>
            <span class="text-sm text-gray-500">
              Usado {{ resumen.porcentaje_usado }} % · disponible {{ resumen.porcentaje_disponible }} %
            </span>
          </div>

          <ul v-if="evaluaciones.length" class="divide-y mb-4">
            <li
              v-for="fila in evaluaciones"
              :key="fila.evaluacion.id"
              class="flex items-center justify-between py-2"
            >
              <span>
                <span class="font-medium text-gray-800">{{ fila.evaluacion.nombre }}</span>
                <span class="ml-2 text-sm text-gray-500">{{ Number(fila.evaluacion.porcentaje) }} %</span>
                <span class="ml-2 text-xs text-gray-400">{{ fila.evaluacion.calificaciones_count }} notas</span>
              </span>
              <button
                v-if="resumen.editable"
                :disabled="fila.evaluacion.calificaciones_count > 0"
                :title="fila.evaluacion.calificaciones_count > 0 ? 'Tiene notas registradas' : 'Eliminar'"
                class="px-3 py-1 rounded-lg text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                @click="eliminarEvaluacion(fila.evaluacion)"
              >
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 mb-4">Aún no hay evaluaciones en este periodo.</p>

          <form
            v-if="resumen.editable && resumen.porcentaje_disponible > 0"
            class="flex flex-wrap items-start gap-3"
            @submit.prevent="crearEvaluacion"
          >
            <div>
              <input
                v-model="nueva.nombre"
                maxlength="50"
                placeholder="Nombre (ej. Examen 1)"
                class="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p v-if="erroresNueva.nombre" class="text-xs text-red-600 mt-1">{{ erroresNueva.nombre[0] }}</p>
            </div>
            <div>
              <input
                v-model="nueva.porcentaje"
                type="number"
                step="0.01"
                min="0.01"
                :max="resumen.porcentaje_disponible"
                placeholder="%"
                class="w-28 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p v-if="erroresNueva.porcentaje" class="text-xs text-red-600 mt-1">
                {{ erroresNueva.porcentaje[0] }}
              </p>
            </div>
            <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Agregar evaluación
            </button>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <div class="p-6 border-b flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-xl font-semibold text-gray-800">
              Calificaciones -
              {{ asignacionActual ? etiqueta(asignacionActual) : "Seleccione asignatura" }}
            </h2>
            <button
              v-if="resumen.editable && evaluaciones.length"
              :disabled="guardando || hayInvalidas || !cambios.length"
              class="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50"
              @click="guardar"
            >
              {{ guardando ? "Guardando..." : "Guardar notas" }}
            </button>
          </div>

          <p v-if="cargando" class="p-6 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>Cargando...
          </p>
          <p v-else-if="!estudiantes.length" class="p-6 text-sm text-gray-500">
            No hay estudiantes con matrícula aprobada en esta sección.
          </p>
          <p v-else-if="!evaluaciones.length" class="p-6 text-sm text-gray-500">
            Agregue una evaluación para registrar notas.
          </p>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Estudiante
                  </th>
                  <th
                    v-for="fila in evaluaciones"
                    :key="fila.evaluacion.id"
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    {{ fila.evaluacion.nombre }} {{ Number(fila.evaluacion.porcentaje) }}%
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Acumulado
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Boleta
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="m in estudiantes"
                  :key="m.id"
                  class="border-t border-gray-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="pi pi-user text-blue-600"></i>
                      </div>
                      <span class="font-semibold text-gray-800">{{ m.estudiante?.nombre }}</span>
                    </div>
                  </td>

                  <td v-for="fila in evaluaciones" :key="fila.evaluacion.id" class="px-6 py-5 text-center">
                    <input
                      v-model="fila.notas[m.id]"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      :disabled="!resumen.editable"
                      :class="notaInvalida(fila.notas[m.id]) ? 'border-red-400' : 'border-gray-200'"
                      class="w-20 px-2 py-1 rounded-lg border text-center focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
                    />
                  </td>

                  <td class="px-6 py-5 text-center font-bold text-blue-600">{{ acumulado(m.id) }}</td>
                  <td class="px-6 py-5 text-center text-gray-700">{{ boletaDe(m.id) ?? "—" }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="hayInvalidas" class="px-6 py-3 text-sm text-red-600">
              Las notas van de 0 a 10, con dos decimales como máximo.
            </p>
          </div>
        </div>

        <!-- Libreta: boletas del periodo -->
        <div v-if="libreta" class="bg-white rounded-2xl shadow-md p-6 mt-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Libreta del periodo</h2>
              <p class="text-sm" :class="libreta.completa ? 'text-green-700' : 'text-amber-700'">
                {{
                  libreta.completa
                    ? "Las notas están completas: puede generar las boletas."
                    : libreta.motivo
                }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Al cambiar una nota, las boletas ya generadas se actualizan solas.
              </p>
            </div>
            <button
              v-if="libreta.editable"
              :disabled="generando || !libreta.completa || cambios.length > 0"
              :title="cambios.length ? 'Guarde las notas primero' : ''"
              class="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              @click="generarLibreta"
            >
              {{ generando ? "Generando..." : "Generar libreta" }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { asignacionService } from "../../services/asignacionService";
import { conductaService } from "../../services/conductaService";

// Diagrama: SIGA Docente > Conducta > Registrar observaciones y Seguimiento conductual
const secciones = ref([]);
const seccionId = ref("");
const periodos = ref([]);
const periodoId = ref("");
const valoraciones = ref([]);
const editable = ref(false);

// Filas: { matricula_id, estudiante, descripcion, valoracion, original }
const filas = ref([]);

const cargando = ref(true);
const guardando = ref(false);
const error = ref("");
const aviso = ref("");
const errores = ref({});

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

const etiqueta = (s) => `${s.grado?.nombre ?? ""} ${s.nombre ?? ""}`.trim();

const cambiadas = computed(() =>
  filas.value.filter(
    (f) =>
      (f.descripcion.trim() || f.valoracion) &&
      (f.descripcion.trim() !== (f.original?.descripcion ?? "") || f.valoracion !== (f.original?.valoracion ?? ""))
  )
);

const incompletas = computed(() => cambiadas.value.filter((f) => !f.descripcion.trim() || !f.valoracion));

const claseValoracion = (v) =>
  ({
    Excelente: "bg-green-100 text-green-700",
    Bueno: "bg-blue-100 text-blue-700",
    Malo: "bg-yellow-100 text-yellow-700",
    Deficiente: "bg-red-100 text-red-700",
  })[v] ?? "bg-gray-100 text-gray-500";

const cargar = async (periodo = null) => {
  filas.value = [];
  if (!seccionId.value) return;
  cargando.value = true;
  error.value = "";
  errores.value = {};
  try {
    const data = await conductaService.listar(seccionId.value, periodo);
    periodos.value = data.periodos;
    valoraciones.value = data.valoraciones;
    editable.value = data.editable;
    if (String(periodoId.value) !== String(data.periodo?.id ?? "")) {
      periodoId.value = data.periodo?.id ?? "";
    }
    filas.value = data.estudiantes.map((e) => ({
      matricula_id: e.matricula_id,
      estudiante: e.estudiante,
      descripcion: e.conducta?.descripcion ?? "",
      valoracion: e.conducta?.valoracion ?? "",
      original: e.conducta,
    }));
  } catch (e) {
    error.value = mensaje(e, "No se pudo cargar la conducta.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    const carga = await asignacionService.miCarga();
    secciones.value = (carga.secciones ?? []).map((s) => s.seccion);
    seccionId.value = secciones.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensaje(e, "No se pudo cargar tu carga académica.");
  } finally {
    cargando.value = false;
  }
});

watch(seccionId, () => {
  periodoId.value = "";
  cargar();
});

const cambiarPeriodo = () => {
  aviso.value = "";
  cargar(periodoId.value);
};

// Conducta.registrar() / actualizar(descripcion, valoracion)
const guardar = async () => {
  if (!cambiadas.value.length || incompletas.value.length) return;
  guardando.value = true;
  error.value = "";
  aviso.value = "";
  errores.value = {};
  try {
    const r = await conductaService.guardar(
      seccionId.value,
      periodoId.value,
      cambiadas.value.map((f) => ({
        matricula_id: f.matricula_id,
        descripcion: f.descripcion.trim(),
        valoracion: f.valoracion,
      }))
    );
    await cargar(periodoId.value);
    aviso.value = `Conducta guardada: ${r.registradas} registradas, ${r.actualizadas} actualizadas.`;
  } catch (e) {
    errores.value = e.response?.data?.errors ?? {};
    error.value = mensaje(e, "No se pudo guardar la conducta.");
  } finally {
    guardando.value = false;
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Evaluación de Conducta</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6 flex flex-wrap items-end gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Sección </label>
            <select v-model="seccionId" class="px-4 py-2 border border-gray-300 rounded-lg">
              <option v-if="!secciones.length" value="">Sin secciones</option>
              <option v-for="s in secciones" :key="s.id" :value="s.id">{{ etiqueta(s) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Periodo </label>
            <select v-model="periodoId" class="px-4 py-2 border border-gray-300 rounded-lg" @change="cambiarPeriodo">
              <option v-if="!periodos.length" value="">Sin periodos</option>
              <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
            </select>
          </div>
        </section>

        <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
        <p v-if="aviso" class="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{{ aviso }}</p>
        <p
          v-if="periodoId && !cargando && !editable"
          class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          El año lectivo de este periodo no está activo: la conducta solo se puede consultar.
        </p>

        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <div class="p-6 border-b flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-gray-800">Observaciones del periodo</h2>
            <button
              v-if="editable && filas.length"
              :disabled="guardando || !cambiadas.length || incompletas.length > 0"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              @click="guardar"
            >
              {{ guardando ? "Guardando..." : "Guardar conducta" }}
            </button>
          </div>

          <p v-if="cargando" class="p-6 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>Cargando...
          </p>
          <p v-else-if="!filas.length" class="p-6 text-sm text-gray-500">
            No hay estudiantes con matrícula aprobada en esta sección.
          </p>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Estudiante</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Observación</th>
                  <th class="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-600">Valoración</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(f, i) in filas" :key="f.matricula_id" class="border-t border-gray-100">
                  <td class="px-6 py-4 font-semibold text-gray-800">{{ f.estudiante?.nombre }}</td>
                  <td class="px-6 py-4">
                    <input
                      v-model="f.descripcion"
                      maxlength="100"
                      :disabled="!editable"
                      placeholder="Ej. Respeta las normas de convivencia"
                      class="w-full min-w-64 px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                    <p v-if="errores[`conductas.${i}.descripcion`]" class="text-xs text-red-600 mt-1">
                      {{ errores[`conductas.${i}.descripcion`][0] }}
                    </p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <select
                      v-if="editable"
                      v-model="f.valoracion"
                      class="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Seleccione</option>
                      <option v-for="v in valoraciones" :key="v" :value="v">{{ v }}</option>
                    </select>
                    <span
                      v-else
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="claseValoracion(f.valoracion)"
                    >
                      {{ f.valoracion || "Sin registrar" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="incompletas.length" class="px-6 py-3 text-sm text-amber-700">
              Complete la observación y la valoración de cada estudiante que modificó.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

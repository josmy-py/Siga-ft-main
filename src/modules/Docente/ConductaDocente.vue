<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { asignacionService } from "../../services/asignacionService";
import { conductaService } from "../../services/conductaService";

// Diagrama: SIGA Docente > Conducta > Registrar observaciones y Seguimiento conductual
// Pedido de Josmy (23/10/2026): la conducta se evalúa con 5 criterios fijos, cada uno
// con su valoración (tarjeta "Evaluación de Conducta"). Se registra una sola vez por
// estudiante y periodo, cuando el periodo ya terminó (cerrado); al guardar la tarjeta
// se limpia y el estudiante queda "Registrada" hasta el siguiente periodo.
const secciones = ref([]);
const seccionId = ref("");
const periodos = ref([]);
const periodoId = ref("");
const valoraciones = ref([]);
const criterios = ref([]);
const editable = ref(false);
const motivo = ref("");

// Filas: { matricula_id, estudiante, registrada, criterios: [{ criterio, valoracion }] }
const filas = ref([]);

// Tarjeta de evaluación: estudiante elegido, valoraciones por criterio y si solo se consulta
const evaluando = ref(null);
const seleccion = ref([]);
const soloConsulta = ref(false);

const cargando = ref(true);
const guardando = ref(false);
const error = ref("");
const aviso = ref("");
const errores = ref({});

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

const etiqueta = (s) => `${s.grado?.nombre ?? ""} ${s.nombre ?? ""}`.trim();

const registradas = computed(() => filas.value.filter((f) => f.registrada).length);
const completa = computed(() => seleccion.value.length === criterios.value.length && seleccion.value.every((v) => v));

const claseValoracion = (v) =>
  ({
    Excelente: "bg-green-100 text-green-700",
    Bueno: "bg-blue-100 text-blue-700",
    Malo: "bg-yellow-100 text-yellow-700",
    Deficiente: "bg-red-100 text-red-700",
  })[v] ?? "bg-gray-100 text-gray-500";

const cerrarTarjeta = () => {
  evaluando.value = null;
  seleccion.value = [];
  errores.value = {};
};

const cargar = async (periodo = null) => {
  filas.value = [];
  cerrarTarjeta();
  if (!seccionId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    const data = await conductaService.listar(seccionId.value, periodo);
    periodos.value = data.periodos;
    valoraciones.value = data.valoraciones;
    criterios.value = data.criterios ?? [];
    editable.value = data.editable;
    motivo.value = data.motivo ?? "";
    if (String(periodoId.value) !== String(data.periodo?.id ?? "")) {
      periodoId.value = data.periodo?.id ?? "";
    }
    filas.value = data.estudiantes;
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
  aviso.value = "";
  cargar();
});

const cambiarPeriodo = () => {
  aviso.value = "";
  cargar(periodoId.value);
};

const evaluar = (fila) => {
  aviso.value = "";
  errores.value = {};
  evaluando.value = fila;
  soloConsulta.value = fila.registrada || !editable.value;
  seleccion.value = fila.criterios.map((c) => c.valoracion ?? "");
};

// Conducta.registrar(): los 5 criterios del estudiante, una sola vez en el periodo
const guardar = async () => {
  if (!evaluando.value || !completa.value) return;
  guardando.value = true;
  error.value = "";
  aviso.value = "";
  errores.value = {};
  const nombre = evaluando.value.estudiante?.nombre;
  try {
    await conductaService.registrar(seccionId.value, periodoId.value, evaluando.value.matricula_id, seleccion.value);
    await cargar(periodoId.value);
    aviso.value = `Conducta de ${nombre} registrada.`;
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
        <p v-if="periodoId && !cargando && motivo" class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {{ motivo }}
        </p>

        <!-- EVALUACIÓN DE CONDUCTA (como la imagen de Josmy) -->
        <div v-if="evaluando" class="mb-6 bg-white rounded-2xl shadow-md p-6 lg:p-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">
            Evaluación de Conducta - {{ evaluando.estudiante?.nombre }}
          </h2>
          <div class="divide-y divide-gray-100">
            <div
              v-for="(criterio, i) in criterios"
              :key="criterio"
              class="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-gray-700 font-medium">{{ i + 1 }}. {{ criterio }}</p>
              <div class="shrink-0">
                <select
                  v-if="!soloConsulta"
                  v-model="seleccion[i]"
                  class="w-48 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccione</option>
                  <option v-for="v in valoraciones" :key="v" :value="v">{{ v }}</option>
                </select>
                <span v-else class="px-3 py-1 rounded-full text-xs font-semibold" :class="claseValoracion(seleccion[i])">
                  {{ seleccion[i] || "Sin registrar" }}
                </span>
                <p v-if="errores[`valoraciones.${i}`]" class="text-xs text-red-600 mt-1">{{ errores[`valoraciones.${i}`][0] }}</p>
              </div>
            </div>
          </div>
          <p v-if="!soloConsulta" class="mt-4 text-sm text-gray-500">
            La conducta se guarda una sola vez en el periodo: después ya no se puede modificar.
          </p>
          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" @click="cerrarTarjeta">
              {{ soloConsulta ? "Cerrar" : "Cancelar" }}
            </button>
            <button
              v-if="!soloConsulta"
              :disabled="guardando || !completa"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              @click="guardar"
            >
              {{ guardando ? "Guardando..." : "Guardar conducta" }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <div class="p-6 border-b flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-gray-800">Conducta del periodo</h2>
            <span v-if="filas.length" class="text-sm text-gray-500">{{ registradas }} de {{ filas.length }} registradas</span>
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
                  <th class="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-600">Estado</th>
                  <th class="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in filas" :key="f.matricula_id" class="border-t border-gray-100">
                  <td class="px-6 py-4 font-semibold text-gray-800">{{ f.estudiante?.nombre }}</td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="f.registrada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                    >
                      {{ f.registrada ? "Registrada" : "Pendiente" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button
                      v-if="f.registrada"
                      class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-600 hover:text-white transition"
                      @click="evaluar(f)"
                    >
                      <i class="pi pi-eye"></i> Ver
                    </button>
                    <button
                      v-else-if="editable"
                      class="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      @click="evaluar(f)"
                    >
                      Evaluar
                    </button>
                    <span v-else class="text-sm text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

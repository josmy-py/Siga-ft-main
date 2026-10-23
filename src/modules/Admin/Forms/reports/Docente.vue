<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { reporteService } from "@/services/reporteService";
import { asignacionService } from "@/services/asignacionService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";
import { textoNivelAcademico } from "@/services/nivelAcademico";

// Portal director > Reportes > Reporte Docente (formulario y diseño de PDF de
// Josmy, 20 y 21/10/2026). El backend genera el PDF con dompdf. Total de Docentes
// (profesores registrados) y Docentes Activos (con carga académica en el año del
// período) salen de la base y aquí solo se muestran; lo demás (asistencia,
// evaluación, capacitaciones) no existe en el sistema y se llena a mano. No se
// guarda en la base de datos. El PDF lleva la fecha del día en que se genera.
const emit = defineEmits(["cerrar"]);
const auth = useAuthStore();
const CARGOS = ["Director", "Directora"];
const fechaHoy = fechaLegible(hoy());

const form = ref({
  periodo_id: "",
  director: "",
  cargo: "Director",
  docentes_ausentes: "",
  asistencia_promedio: "",
  docentes_incapacitados: "",
  docentes_evaluados: "",
  promedio_evaluacion: "",
  descripcion_general: "",
  capacitaciones_realizadas: "",
  docentes_participantes: "",
  detalles_capacitaciones: "",
  reconocimientos: "",
  observaciones: "",
});

const periodos = ref([]);
const indicadores = ref(null);
const cargando = ref(false);
const generando = ref(false);
const aviso = ref("");

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

onMounted(async () => {
  try {
    const carga = await asignacionService.listar();
    if (carga.anio_lectivo_id) {
      periodos.value = await reporteService.periodos(carga.anio_lectivo_id);
      form.value.periodo_id = periodos.value[0]?.id ?? "";
    }
  } catch (e) {
    aviso.value = mensaje(e, "No se pudieron cargar los periodos del año activo.");
  }
});

// Los mismos indicadores que imprime el PDF
watch(
  () => form.value.periodo_id,
  async (periodoId) => {
    indicadores.value = null;
    if (!periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      indicadores.value = await reporteService.docenteIndicadores(periodoId);
    } catch (e) {
      aviso.value = mensaje(e, "No se pudieron calcular los indicadores de docentes.");
    } finally {
      cargando.value = false;
    }
  },
);

// Mensaje de error de una respuesta pedida como blob (422, 404...)
const errorDeBlob = async (e) => {
  try {
    const cuerpo = JSON.parse(await e.response.data.text());
    return Object.values(cuerpo.errors ?? {})[0]?.[0] ?? cuerpo.message;
  } catch {
    return null;
  }
};

const vacioANull = (v) => (v === "" || v === null || v === undefined ? null : v);

const generar = async () => {
  const f = form.value;
  generando.value = true;
  try {
    const pdf = await reporteService.docentePdf({
      periodo_escolar_id: f.periodo_id,
      director: f.director,
      cargo: f.cargo,
      docentes_ausentes: f.docentes_ausentes,
      docentes_incapacitados: f.docentes_incapacitados,
      asistencia_promedio: vacioANull(f.asistencia_promedio),
      docentes_evaluados: f.docentes_evaluados,
      promedio_evaluacion: vacioANull(f.promedio_evaluacion),
      descripcion_general: f.descripcion_general,
      capacitaciones_realizadas: vacioANull(f.capacitaciones_realizadas),
      docentes_participantes: vacioANull(f.docentes_participantes),
      detalles_capacitaciones: f.detalles_capacitaciones,
      reconocimientos: f.reconocimientos,
      observaciones: f.observaciones,
    });
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    Swal.fire({ icon: "error", title: (await errorDeBlob(e)) ?? "No se pudo generar el reporte." });
  } finally {
    generando.value = false;
  }
};

const entrada =
  "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400";
const soloLectura = `${entrada} bg-gray-50 text-gray-700`;
const area = `${entrada} h-24 resize-y`;
const subtitulo = "flex items-center gap-2 text-lg font-semibold text-gray-700 mt-8 mb-3";
const etiqueta = "block text-xs text-gray-500 mb-1";
</script>

<template>
  <div>
    <div class="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-white shadow-md">
      <h1 class="text-2xl font-bold">Reporte del Personal Docente</h1>
      <p class="mt-3 text-sm text-indigo-100">Registro y consolidación de información sobre el personal</p>
    </div>

    <form class="mt-6 bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg bg-sky-100 flex items-center justify-center">
          <i class="pi pi-users text-sky-600"></i>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Reporte de Personal Docente</h2>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-building text-indigo-500"></i>Identificación</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Período</span>
          <select v-model="form.periodo_id" :class="entrada" required>
            <option value="" disabled>{{ periodos.length ? "Seleccione" : "Sin periodos" }}</option>
            <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }} · {{ textoNivelAcademico(p.nivel) }}</option>
          </select>
        </label>
        <label class="block">
          <span :class="etiqueta">Fecha</span>
          <input :value="fechaHoy" :class="soloLectura" readonly title="El reporte lleva la fecha del día en que se genera" />
        </label>
        <label class="block">
          <span :class="etiqueta">Director</span>
          <input v-model.trim="form.director" :class="entrada" maxlength="100" placeholder="Nombre del Director" required />
        </label>
        <label class="block">
          <span :class="etiqueta">Cargo</span>
          <select v-model="form.cargo" :class="entrada">
            <option v-for="c in CARGOS" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>
      <p class="mt-2 text-xs text-gray-500">El PDF muestra también el correo de la cuenta que lo genera ({{ auth.user?.email }}).</p>

      <h3 :class="subtitulo">
        <i class="pi pi-chart-bar text-violet-500"></i>Estadísticas Generales
        <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Total de Docentes</span>
          <input :value="indicadores ? indicadores.total_docentes : '—'" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Activos</span>
          <input :value="indicadores ? indicadores.docentes_activos : '—'" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Ausentes</span>
          <input v-model="form.docentes_ausentes" type="number" min="0" :max="indicadores?.total_docentes" :class="entrada" placeholder="Docentes Ausentes" required />
        </label>
      </div>
      <p v-if="aviso" class="mt-2 text-xs text-amber-700">{{ aviso }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">
        Total = profesores registrados; Activos = docentes con carga académica en el año del período. Se calculan igual que en el PDF.
      </p>

      <h3 :class="subtitulo"><i class="pi pi-calendar text-green-500"></i>Control de Asistencia</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Asistencia Promedio (%)</span>
          <input v-model="form.asistencia_promedio" type="number" min="0" max="100" step="0.1" :class="entrada" placeholder="Asistencia Promedio (%)" />
        </label>
        <label class="block">
          <span :class="etiqueta">Incapacidades</span>
          <input v-model="form.docentes_incapacitados" type="number" min="0" :max="indicadores?.total_docentes" :class="entrada" placeholder="Incapacidades" required />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-star text-yellow-500"></i>Desempeño Docente</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Docentes Evaluados</span>
          <input v-model="form.docentes_evaluados" type="number" min="0" :max="indicadores?.total_docentes" :class="entrada" placeholder="Docentes Evaluados" required />
        </label>
        <label class="block">
          <span :class="etiqueta">Promedio de Evaluación</span>
          <input v-model="form.promedio_evaluacion" type="number" min="0" max="10" step="0.01" :class="entrada" placeholder="Promedio de Evaluación" />
        </label>
      </div>
      <textarea v-model="form.descripcion_general" :class="[area, 'mt-4']" maxlength="3000" placeholder="Descripción general del desempeño docente..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-graduation-cap text-violet-500"></i>Capacitaciones</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Capacitaciones Realizadas</span>
          <input v-model="form.capacitaciones_realizadas" type="number" min="0" :class="entrada" placeholder="Capacitaciones Realizadas" />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Participantes</span>
          <input v-model="form.docentes_participantes" type="number" min="0" :max="indicadores?.total_docentes" :class="entrada" placeholder="Docentes Participantes" />
        </label>
      </div>
      <textarea v-model="form.detalles_capacitaciones" :class="[area, 'mt-4']" maxlength="3000" placeholder="Detalle de capacitaciones desarrolladas..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-trophy text-amber-500"></i>Reconocimientos y Logros</h3>
      <textarea v-model="form.reconocimientos" :class="area" maxlength="3000" placeholder="Un reconocimiento o logro por línea..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-comment text-gray-500"></i>Observaciones Generales</h3>
      <textarea v-model="form.observaciones" :class="area" maxlength="3000" placeholder="Observaciones adicionales sobre el personal docente..."></textarea>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          Cancelar
        </button>
        <button type="submit" :disabled="generando || !indicadores" class="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
          <i :class="['pi mr-2', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Reporte
        </button>
      </div>
    </form>
  </div>
</template>

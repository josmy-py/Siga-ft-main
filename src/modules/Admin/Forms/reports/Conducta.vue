<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { reporteService } from "@/services/reporteService";
import { asignacionService } from "@/services/asignacionService";
import { dato, fechaLegible, fila, hoy, imprimirReporte, seccion, texto } from "@/components/reportes/documentoReporte";

// Portal director > Reportes > Reporte de Conducta (formulario de Josmy,
// 21/10/2026). Total de Estudiantes (matrículas aprobadas del año del período)
// sale de la base y aquí solo se muestra; la clasificación de reportes, los
// incidentes y las medidas no existen en el sistema y se llenan a mano. No se
// guarda en la base de datos. La fecha es la del día en que se genera. El PDF con
// dompdf queda pendiente del diseño de Josmy: mientras tanto "Generar Reporte"
// abre el documento para imprimirlo o guardarlo como PDF.
const emit = defineEmits(["cerrar"]);
const fechaHoy = fechaLegible(hoy());
const MEDIDAS = ["Amonestación Verbal", "Amonestación Escrita", "Citación a Padres", "Suspensión"];

const form = ref({
  periodo_id: "",
  director: "",
  leves: "",
  moderados: "",
  graves: "",
  incidentes: "",
  medidas: [],
  detalle_medidas: "",
  recomendaciones: "",
  observaciones: "",
});

const periodos = ref([]);
const indicadores = ref(null);
const cargando = ref(false);
const aviso = ref("");

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;
const periodoActual = computed(() => periodos.value.find((p) => String(p.id) === String(form.value.periodo_id)));

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

// Total de estudiantes del año del período
watch(
  () => form.value.periodo_id,
  async (periodoId) => {
    indicadores.value = null;
    if (!periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      indicadores.value = await reporteService.conductaIndicadores(periodoId);
    } catch (e) {
      aviso.value = mensaje(e, "No se pudo calcular el total de estudiantes.");
    } finally {
      cargando.value = false;
    }
  },
);

const generar = () => {
  const f = form.value;
  imprimirReporte({
    titulo: "Reporte de Conducta",
    subtitulo: "Reporte de Conducta y Convivencia Escolar",
    cuerpo: [
      seccion("Identificación", fila(dato("Período", periodoActual.value?.nombre), dato("Fecha", fechaHoy), dato("Director responsable", f.director))),
      seccion("Resumen General", fila(dato("Total de Estudiantes", indicadores.value?.total_estudiantes))),
      seccion("Clasificación de Reportes", fila(dato("Reportes Leves", f.leves), dato("Reportes Moderados", f.moderados), dato("Reportes Graves", f.graves))),
      seccion("Incidentes Registrados", texto(f.incidentes)),
      seccion("Medidas Disciplinarias Aplicadas", fila(dato("Medidas", f.medidas.join(", "))) + texto(f.detalle_medidas)),
      seccion("Recomendaciones", texto(f.recomendaciones)),
      seccion("Observaciones Generales", texto(f.observaciones)),
    ].join(""),
    firma: [f.director, "Director responsable"],
  });
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
      <h1 class="text-2xl font-bold">Reporte de Conducta</h1>
      <p class="mt-3 text-sm text-indigo-100">Registro de comportamiento académico.</p>
    </div>

    <form class="mt-6 bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
          <i class="pi pi-shield text-red-600"></i>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Reporte de Conducta y Convivencia Escolar</h2>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-building text-indigo-500"></i>Identificación</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Período</span>
          <select v-model="form.periodo_id" :class="entrada" required>
            <option value="" disabled>{{ periodos.length ? "Seleccione" : "Sin periodos" }}</option>
            <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
        </label>
        <label class="block">
          <span :class="etiqueta">Fecha</span>
          <input :value="fechaHoy" :class="soloLectura" readonly title="El reporte lleva la fecha del día en que se genera" />
        </label>
        <label class="block">
          <span :class="etiqueta">Director responsable</span>
          <input v-model.trim="form.director" :class="entrada" maxlength="100" placeholder="Director Responsable" required />
        </label>
      </div>

      <h3 :class="subtitulo">
        <i class="pi pi-chart-bar text-violet-500"></i>Resumen General
        <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Total de Estudiantes</span>
          <input :value="indicadores ? indicadores.total_estudiantes : '—'" :class="soloLectura" readonly />
        </label>
      </div>
      <p v-if="aviso" class="mt-2 text-xs text-amber-700">{{ aviso }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">Estudiantes con matrícula aprobada en el año del período.</p>

      <h3 :class="subtitulo"><i class="pi pi-exclamation-triangle text-orange-500"></i>Clasificación de Reportes</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Reportes Leves</span>
          <input v-model="form.leves" type="number" min="0" :class="entrada" placeholder="Reportes Leves" />
        </label>
        <label class="block">
          <span :class="etiqueta">Reportes Moderados</span>
          <input v-model="form.moderados" type="number" min="0" :class="entrada" placeholder="Reportes Moderados" />
        </label>
        <label class="block">
          <span :class="etiqueta">Reportes Graves</span>
          <input v-model="form.graves" type="number" min="0" :class="entrada" placeholder="Reportes Graves" />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-flag text-red-500"></i>Incidentes Registrados</h3>
      <textarea v-model="form.incidentes" :class="area" maxlength="3000" placeholder="Descripción general de incidentes ocurridos durante el período..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-list-check text-indigo-500"></i>Medidas Disciplinarias Aplicadas</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        <label v-for="m in MEDIDAS" :key="m" class="flex items-center gap-2 text-sm text-gray-700">
          <input v-model="form.medidas" type="checkbox" :value="m" class="h-4 w-4 rounded border-gray-300" />{{ m }}
        </label>
      </div>
      <textarea v-model="form.detalle_medidas" :class="[area, 'mt-4']" maxlength="3000" placeholder="Detalle de medidas disciplinarias aplicadas..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-lightbulb text-amber-500"></i>Recomendaciones</h3>
      <textarea v-model="form.recomendaciones" :class="area" maxlength="3000" placeholder="Acciones preventivas y recomendaciones para mejorar la convivencia escolar..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-comment text-gray-500"></i>Observaciones Generales</h3>
      <textarea v-model="form.observaciones" :class="area" maxlength="3000" placeholder="Observaciones adicionales..."></textarea>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          Cancelar
        </button>
        <button type="submit" :disabled="!indicadores" class="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
          <i class="pi pi-file-pdf mr-2"></i>Generar Reporte
        </button>
      </div>
    </form>
  </div>
</template>

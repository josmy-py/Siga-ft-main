<script setup>
import { ref, computed, onMounted } from "vue";
import { reporteService } from "@/services/reporteService";
import { profesorService } from "@/services/profesorService";
import { asignacionService } from "@/services/asignacionService";
import { dato, fechaLegible, fila, hoy, imprimirReporte, porcentaje, seccion, texto } from "@/components/reportes/documentoReporte";

// Portal director > Reportes > Reporte Docente (formulario de Josmy, 20/10/2026).
// No se guarda en la base de datos: "Generar Reporte" abre el documento para
// imprimirlo o guardarlo como PDF. Solo se precargan Total de Docentes (profesores
// registrados) y Docentes Activos (con carga académica en el año); lo demás
// (asistencia, evaluación, capacitaciones) no existe en el sistema y se llena a mano.
const emit = defineEmits(["cerrar"]);

const form = ref({
  periodo_id: "",
  fecha: hoy(),
  director: "",
  total_docentes: "",
  docentes_activos: "",
  docentes_ausentes: "",
  asistencia_promedio: "",
  incapacidades: "",
  docentes_evaluados: "",
  promedio_evaluacion: "",
  desempeno: "",
  capacitaciones_realizadas: "",
  docentes_participantes: "",
  capacitaciones: "",
  reconocimientos: "",
  observaciones: "",
});

const periodos = ref([]);
const cargando = ref(true);
const aviso = ref("");

const periodoActual = computed(() => periodos.value.find((p) => String(p.id) === String(form.value.periodo_id)));

onMounted(async () => {
  try {
    const [profesores, carga] = await Promise.all([profesorService.listar(), asignacionService.listar()]);
    const conCarga = new Set((carga.asignaciones ?? []).map((a) => a.profesor_id ?? a.profesor?.id).filter(Boolean));
    form.value.total_docentes = (profesores ?? []).length;
    form.value.docentes_activos = conCarga.size;
    if (carga.anio_lectivo_id) {
      periodos.value = await reporteService.periodos(carga.anio_lectivo_id);
      form.value.periodo_id = periodos.value[0]?.id ?? "";
    }
  } catch (e) {
    aviso.value = e.response?.data?.message ?? "No se pudieron cargar los docentes; los datos se pueden llenar a mano.";
  } finally {
    cargando.value = false;
  }
});

const generar = () => {
  const f = form.value;
  imprimirReporte({
    titulo: "Reporte del Personal Docente",
    subtitulo: "Registro y consolidación de información sobre el personal",
    cuerpo: [
      seccion("Identificación", fila(dato("Período", periodoActual.value?.nombre_periodo), dato("Fecha", fechaLegible(f.fecha)), dato("Director", f.director))),
      seccion(
        "Estadísticas Generales",
        fila(dato("Total de Docentes", f.total_docentes), dato("Docentes Activos", f.docentes_activos), dato("Docentes Ausentes", f.docentes_ausentes)),
      ),
      seccion("Control de Asistencia", fila(dato("Asistencia Promedio", porcentaje(f.asistencia_promedio)), dato("Incapacidades", f.incapacidades))),
      seccion(
        "Desempeño Docente",
        fila(dato("Docentes Evaluados", f.docentes_evaluados), dato("Promedio de Evaluación", f.promedio_evaluacion)) + texto(f.desempeno),
      ),
      seccion(
        "Capacitaciones",
        fila(dato("Capacitaciones Realizadas", f.capacitaciones_realizadas), dato("Docentes Participantes", f.docentes_participantes)) +
          texto(f.capacitaciones),
      ),
      seccion("Reconocimientos y Logros", texto(f.reconocimientos)),
      seccion("Observaciones Generales", texto(f.observaciones)),
    ].join(""),
    firma: [f.director, "Director"],
  });
};

const entrada =
  "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400";
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Período</span>
          <select v-model="form.periodo_id" :class="entrada" required>
            <option value="" disabled>{{ periodos.length ? "Seleccione" : "Sin periodos" }}</option>
            <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre_periodo }}</option>
          </select>
        </label>
        <label class="block">
          <span :class="etiqueta">Fecha</span>
          <input v-model="form.fecha" type="date" :class="entrada" required />
        </label>
        <label class="block">
          <span :class="etiqueta">Director</span>
          <input v-model.trim="form.director" :class="entrada" placeholder="Director" required />
        </label>
      </div>

      <h3 :class="subtitulo">
        <i class="pi pi-chart-bar text-violet-500"></i>Estadísticas Generales
        <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Total de Docentes</span>
          <input v-model="form.total_docentes" type="number" min="0" :class="entrada" placeholder="Total de Docentes" />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Activos</span>
          <input v-model="form.docentes_activos" type="number" min="0" :class="entrada" placeholder="Docentes Activos" />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Ausentes</span>
          <input v-model="form.docentes_ausentes" type="number" min="0" :class="entrada" placeholder="Docentes Ausentes" />
        </label>
      </div>
      <p v-if="aviso" class="mt-2 text-xs text-amber-700">{{ aviso }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">
        Total = profesores registrados; Activos = docentes con carga académica en el año. Se pueden corregir.
      </p>

      <h3 :class="subtitulo"><i class="pi pi-calendar text-green-500"></i>Control de Asistencia</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Asistencia Promedio (%)</span>
          <input v-model="form.asistencia_promedio" type="number" min="0" max="100" step="0.1" :class="entrada" placeholder="Asistencia Promedio (%)" />
        </label>
        <label class="block">
          <span :class="etiqueta">Incapacidades</span>
          <input v-model="form.incapacidades" type="number" min="0" :class="entrada" placeholder="Incapacidades" />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-star text-yellow-500"></i>Desempeño Docente</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Docentes Evaluados</span>
          <input v-model="form.docentes_evaluados" type="number" min="0" :class="entrada" placeholder="Docentes Evaluados" />
        </label>
        <label class="block">
          <span :class="etiqueta">Promedio de Evaluación</span>
          <input v-model="form.promedio_evaluacion" type="number" min="0" max="10" step="0.01" :class="entrada" placeholder="Promedio de Evaluación" />
        </label>
      </div>
      <textarea v-model="form.desempeno" :class="[area, 'mt-4']" placeholder="Descripción general del desempeño docente..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-graduation-cap text-violet-500"></i>Capacitaciones</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Capacitaciones Realizadas</span>
          <input v-model="form.capacitaciones_realizadas" type="number" min="0" :class="entrada" placeholder="Capacitaciones Realizadas" />
        </label>
        <label class="block">
          <span :class="etiqueta">Docentes Participantes</span>
          <input v-model="form.docentes_participantes" type="number" min="0" :class="entrada" placeholder="Docentes Participantes" />
        </label>
      </div>
      <textarea v-model="form.capacitaciones" :class="[area, 'mt-4']" placeholder="Detalle de capacitaciones desarrolladas..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-trophy text-amber-500"></i>Reconocimientos y Logros</h3>
      <textarea v-model="form.reconocimientos" :class="area" placeholder="Docentes destacados y logros obtenidos..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-comment text-gray-500"></i>Observaciones Generales</h3>
      <textarea v-model="form.observaciones" :class="area" placeholder="Observaciones adicionales sobre el personal docente..."></textarea>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          Cancelar
        </button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700">
          <i class="pi pi-file-pdf mr-2"></i>Generar Reporte
        </button>
      </div>
    </form>
  </div>
</template>

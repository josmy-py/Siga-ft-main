<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { asignacionService } from "@/services/asignacionService";
import { reporteService } from "@/services/reporteService";
import { dato, fila, imprimirReporte, seccion, tabla, texto } from "@/components/reportes/documentoReporte";

// Portal docente > Reportes > Boletas de Calificaciones: libreta de notas de un
// estudiante (formulario de Josmy, 20/10/2026). Las asignaturas y calificaciones
// salen del reporte de notas existente (boletas del periodo de cada materia de
// la sección; el guía ve todas, los demás docentes solo las suyas). La conducta
// registrada se precarga y es editable. No se guarda en la base de datos:
// "Generar Reporte" abre el documento para imprimirlo o guardarlo como PDF.
const emit = defineEmits(["cerrar"]);
const MAX_OBSERVACIONES = 500;

const carga = ref([]); // [{ id, nombre, grado_id, grado }]
const periodos = ref([]);
const notas = ref(null);
const conductas = ref({}); // matricula_id -> { descripcion, valoracion }
const cargando = ref(false);
const aviso = ref("");

const inicial = () => ({
  grado_id: "",
  seccion_id: "",
  periodo_id: "",
  matricula_id: "",
  conducta_general: "",
  conducta_descripcion: "",
  observaciones: "",
});
const form = ref(inicial());

const grados = computed(() => {
  const unicos = new Map();
  carga.value.forEach((s) => unicos.set(s.grado_id, s.grado));
  return [...unicos].map(([id, nombre]) => ({ id, nombre }));
});
const seccionesDelGrado = computed(() => carga.value.filter((s) => String(s.grado_id) === String(form.value.grado_id)));
const gradoActual = computed(() => grados.value.find((g) => String(g.id) === String(form.value.grado_id)));
const seccionActual = computed(() => carga.value.find((s) => String(s.id) === String(form.value.seccion_id)));
const periodoActual = computed(() => periodos.value.find((p) => String(p.id) === String(form.value.periodo_id)));
const profesorResponsable = computed(() => notas.value?.seccion?.profesor?.nombre ?? "");
const estudiantes = computed(() => notas.value?.estudiantes ?? []);
const estudianteActual = computed(() => estudiantes.value.find((e) => String(e.matricula_id) === String(form.value.matricula_id)));

const nota = (v) => (v === null || v === undefined ? "—" : String(Number(Number(v).toFixed(2))));
const calificaciones = computed(() =>
  (notas.value?.materias ?? []).map((m) => ({ nombre: m.nombre, nota: nota(estudianteActual.value?.promedios?.[m.asignacion_id]) })),
);

onMounted(async () => {
  try {
    const datos = await asignacionService.miCarga();
    carga.value = (datos.secciones ?? []).map(({ seccion: s }) => ({
      id: s.id,
      nombre: s.nombre,
      grado_id: s.grado_id ?? s.grado?.id,
      grado: s.grado?.nombre ?? "",
    }));
    if (datos.anio_lectivo?.id) periodos.value = await reporteService.periodos(datos.anio_lectivo.id);
    if (!carga.value.length) aviso.value = "No tiene carga académica en el año lectivo; consulte con el director.";
  } catch (e) {
    aviso.value = e.response?.data?.message ?? "No se pudo cargar su carga académica.";
  }
});

watch(
  () => form.value.grado_id,
  () => {
    if (!seccionesDelGrado.value.some((s) => String(s.id) === String(form.value.seccion_id))) form.value.seccion_id = "";
  },
);

// Notas y conducta de la sección en el periodo
watch(
  () => [form.value.seccion_id, form.value.periodo_id],
  async ([seccionId, periodoId]) => {
    notas.value = null;
    conductas.value = {};
    form.value.matricula_id = "";
    if (!seccionId || !periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      const [n, c] = await Promise.all([
        reporteService.notas("docente", seccionId, periodoId),
        reporteService.conducta("docente", seccionId, periodoId),
      ]);
      notas.value = n;
      conductas.value = Object.fromEntries((c.estudiantes ?? []).map((e) => [e.matricula_id, e.conducta]));
      form.value.matricula_id = n.estudiantes?.[0]?.matricula_id ?? "";
      if (!n.estudiantes?.length) aviso.value = "La sección no tiene estudiantes con matrícula aprobada.";
    } catch (e) {
      aviso.value = e.response?.data?.message ?? "No se pudieron cargar las notas de la sección.";
    } finally {
      cargando.value = false;
    }
  },
);

// Al elegir estudiante se precarga su conducta registrada en el periodo
watch(
  () => form.value.matricula_id,
  (matriculaId) => {
    const conducta = conductas.value[matriculaId];
    form.value.conducta_general = conducta?.valoracion ?? "";
    form.value.conducta_descripcion = conducta?.descripcion ?? "";
  },
);

const limpiar = () => {
  form.value = inicial();
};

const generar = () => {
  const f = form.value;
  const e = estudianteActual.value;
  imprimirReporte({
    titulo: "Libreta de Notas",
    subtitulo: "Reporte de libreta de notas del estudiante",
    cuerpo: [
      seccion(
        "Datos generales",
        fila(dato("Estudiante", e?.estudiante?.nombre), dato("NIE", e?.estudiante?.nie)) +
          fila(dato("Grado", gradoActual.value?.nombre), dato("Sección", seccionActual.value?.nombre), dato("Período", periodoActual.value?.nombre_periodo)) +
          fila(dato("Profesor responsable", profesorResponsable.value)),
      ),
      seccion(
        "Calificaciones",
        tabla(["Asignatura", "Calificación"], [...calificaciones.value.map((c) => [c.nombre, c.nota]), ["Promedio General", nota(e?.promedio)]], {
          resaltarUltima: true,
        }),
      ),
      seccion("Conducta del Estudiante", fila(dato("Conducta general", f.conducta_general)) + texto(f.conducta_descripcion)),
      seccion("Observaciones del Docente", texto(f.observaciones)),
    ].join(""),
    firma: [profesorResponsable.value, "Profesor responsable"],
  });
};

const etiqueta = "block text-sm text-gray-600 mb-1";
const entrada =
  "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
const conIcono = `${entrada} pl-10`;
const icono = "pi absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
const subtitulo = "flex items-center gap-2 text-xl font-semibold text-gray-800 mt-8 mb-3";
const boton = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm";
</script>

<template>
  <form class="bg-white rounded-2xl shadow-sm overflow-hidden" @submit.prevent="generar">
    <div class="bg-gradient-to-r from-blue-600 to-indigo-800 px-6 py-6 text-white flex items-center gap-4">
      <div class="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
        <i class="pi pi-users"></i>
      </div>
      <div>
        <h1 class="text-lg font-bold">REPORTE DE LIBRETA DE NOTAS</h1>
        <p class="mt-2 text-sm text-blue-100">Genere libretas academicas.</p>
      </div>
    </div>

    <div class="p-6">
      <p v-if="aviso" class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ aviso }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        <label class="block">
          <span :class="etiqueta">Grado</span>
          <span class="relative block">
            <i :class="[icono, 'pi-graduation-cap']"></i>
            <select v-model="form.grado_id" :class="conIcono" required>
              <option value="" disabled>Selecciona un grado</option>
              <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
            </select>
          </span>
        </label>
        <label class="block">
          <span :class="etiqueta">Sección</span>
          <span class="relative block">
            <i :class="[icono, 'pi-sitemap']"></i>
            <select v-model="form.seccion_id" :class="conIcono" required>
              <option value="" disabled>Seleccione una sección</option>
              <option v-for="s in seccionesDelGrado" :key="s.id" :value="s.id">{{ s.nombre }}</option>
            </select>
          </span>
        </label>
        <label class="block">
          <span :class="etiqueta">Período</span>
          <span class="relative block">
            <i :class="[icono, 'pi-clock']"></i>
            <select v-model="form.periodo_id" :class="conIcono" required>
              <option value="" disabled>Selecciona un período</option>
              <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre_periodo }}</option>
            </select>
          </span>
        </label>
        <label class="block">
          <span :class="etiqueta">Profesor responsable</span>
          <input :value="profesorResponsable" :class="[entrada, 'bg-gray-50']" readonly />
        </label>
      </div>

      <h3 :class="subtitulo">
        <i class="pi pi-user text-base"></i>Estudiante
        <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
      </h3>
      <span class="relative block">
        <i :class="[icono, 'pi-user']"></i>
        <select v-model="form.matricula_id" :class="conIcono" required>
          <option value="" disabled>{{ estudiantes.length ? "Seleccione un estudiante" : "Sin estudiantes" }}</option>
          <option v-for="e in estudiantes" :key="e.matricula_id" :value="e.matricula_id">{{ e.estudiante?.nombre }}</option>
        </select>
      </span>

      <div v-if="estudianteActual" class="mt-5 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left font-semibold text-gray-800">Asignatura</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-800">Calificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in calificaciones" :key="c.nombre">
              <td class="px-4 py-2.5 text-gray-700">{{ c.nombre }}</td>
              <td class="px-4 py-2.5 font-semibold text-blue-600">{{ c.nota }}</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-4 py-3 font-semibold text-gray-800">Promedio General</td>
              <td class="px-4 py-3 font-bold text-green-600">{{ nota(estudianteActual.promedio) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2 text-xs text-gray-500">
          Cada calificación es el promedio de la boleta del periodo; "—" si aún no se genera la libreta de esa materia.
        </p>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-flag text-base"></i>Conducta del Estudiante</h3>
      <label class="block">
        <span :class="etiqueta">Conducta general</span>
        <input v-model.trim="form.conducta_general" :class="entrada" placeholder="Ej: Buena, Excelente, Regular..." />
      </label>
      <label class="block mt-4">
        <span :class="etiqueta">Descripción</span>
        <textarea v-model="form.conducta_descripcion" :class="[entrada, 'h-20 resize-y']" placeholder="Descripción de la conducta del estudiante..."></textarea>
      </label>

      <label class="block mt-6">
        <span class="block text-sm font-semibold text-gray-800 mb-2">Observaciones del Docente</span>
        <textarea
          v-model="form.observaciones"
          :maxlength="MAX_OBSERVACIONES"
          :class="[entrada, 'h-24 resize-y']"
          placeholder="Ingrese observaciones sobre el rendimiento académico, conducta o recomendaciones para el estudiante..."
        ></textarea>
      </label>
      <div class="mt-1 flex justify-between text-xs text-gray-500">
        <span>Estas observaciones aparecerán en la boleta.</span>
        <span>{{ form.observaciones.length }}/{{ MAX_OBSERVACIONES }}</span>
      </div>

      <div class="mt-8 flex flex-wrap justify-end gap-3">
        <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="limpiar">
          <i class="pi pi-refresh"></i>Limpiar
        </button>
        <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="emit('cerrar')">
          <i class="pi pi-times"></i>Cancelar
        </button>
        <button type="submit" :disabled="!estudianteActual" :class="[boton, 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
          <i class="pi pi-check"></i>Generar Reporte
        </button>
      </div>
    </div>
  </form>
</template>

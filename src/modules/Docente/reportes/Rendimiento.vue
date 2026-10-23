<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { asignacionService } from "@/services/asignacionService";
import { reporteService } from "@/services/reporteService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";
import { periodosDelGrado } from "@/services/nivelAcademico";

// Portal docente > Reportes > Reporte de Rendimiento (formulario de Josmy, 20/10/2026).
// Calificaciones de los alumnos de una sección en una asignatura del docente y un
// período: el promedio de la boleta de cada alumno (reporte de notas existente).
// "Generar Reporte" abre el PDF que arma el backend con dompdf (diseño de Josmy,
// 21/10/2026) con los mismos datos. No se guarda en la base de datos.
const emit = defineEmits(["cerrar"]);
const MAX_OBSERVACIONES = 500;
const NOTA_DESTACADO = 9;

const carga = ref([]); // [{ id, nombre, grado_id, grado, materias: [{ asignacion_id, nombre }] }]
const periodos = ref([]);
const nombreProfesor = ref("");
const notas = ref(null);
const cargando = ref(false);
const aviso = ref("");
const generando = ref(false);

const inicial = () => ({
  grado_id: "",
  seccion_id: "",
  periodo_id: "",
  asignacion_id: "",
  profesor: nombreProfesor.value,
  observaciones: "",
});
const form = ref(inicial());

const grados = computed(() => {
  const unicos = new Map();
  carga.value.forEach((s) => unicos.set(s.grado_id, s.grado));
  return [...unicos].map(([id, nombre]) => ({ id, nombre }));
});
const seccionesDelGrado = computed(() => carga.value.filter((s) => String(s.grado_id) === String(form.value.grado_id)));
// Periodos del nivel académico del grado elegido (Parvularia y Básica o Bachillerato)
const periodosDelNivel = computed(() =>
  periodosDelGrado(periodos.value, carga.value.find((s) => String(s.grado_id) === String(form.value.grado_id))?.grado),
);
watch(periodosDelNivel, (lista) => {
  if (form.value.periodo_id && !lista.some((p) => String(p.id) === String(form.value.periodo_id))) form.value.periodo_id = "";
});
const seccionActual = computed(() => carga.value.find((s) => String(s.id) === String(form.value.seccion_id)));
const materias = computed(() => seccionActual.value?.materias ?? []);

// Uno o dos decimales, igual que el PDF: 9.0, 8.72
const nota = (v) => (v === null || v === undefined ? "—" : Number(v).toFixed(2).replace(/(\.\d)0$/, "$1"));
const alumnos = computed(() =>
  (notas.value?.estudiantes ?? []).map((e) => {
    const valor = e.promedios?.[form.value.asignacion_id];
    return { id: e.matricula_id, nombre: e.estudiante?.nombre ?? "", calificacion: valor === null || valor === undefined ? null : Number(valor) };
  }),
);
const conNota = computed(() => alumnos.value.filter((a) => a.calificacion !== null));
const promedioGeneral = computed(() =>
  conNota.value.length ? (conNota.value.reduce((s, a) => s + a.calificacion, 0) / conNota.value.length).toFixed(2) : "—",
);
const destacados = computed(() =>
  conNota.value.filter((a) => a.calificacion >= NOTA_DESTACADO).sort((a, b) => b.calificacion - a.calificacion),
);

onMounted(async () => {
  try {
    const datos = await asignacionService.miCarga();
    nombreProfesor.value = datos.profesor?.nombre ?? "";
    form.value.profesor = nombreProfesor.value;
    carga.value = (datos.secciones ?? []).map(({ seccion: s, materias: m }) => ({
      id: s.id,
      nombre: s.nombre,
      grado_id: s.grado_id ?? s.grado?.id,
      grado: s.grado?.nombre ?? "",
      materias: (m ?? []).map((x) => ({ asignacion_id: x.asignacion_id, nombre: x.nombre })),
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
watch(
  () => form.value.seccion_id,
  () => {
    form.value.asignacion_id = materias.value[0]?.asignacion_id ?? "";
  },
);

// Notas de la sección en el período (una consulta; la asignatura solo filtra la columna)
watch(
  () => [form.value.seccion_id, form.value.periodo_id],
  async ([seccionId, periodoId]) => {
    notas.value = null;
    if (!seccionId || !periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      notas.value = await reporteService.notas("docente", seccionId, periodoId);
      if (!notas.value.estudiantes?.length) aviso.value = "La sección no tiene estudiantes con matrícula aprobada.";
    } catch (e) {
      aviso.value = e.response?.data?.message ?? "No se pudieron cargar las notas de la sección.";
    } finally {
      cargando.value = false;
    }
  },
);

const limpiar = () => {
  form.value = inicial();
};

// Mensaje de error de una respuesta pedida como blob (422, 404...)
const errorDeBlob = async (e) => {
  try {
    const cuerpo = JSON.parse(await e.response.data.text());
    return Object.values(cuerpo.errors ?? {})[0]?.[0] ?? cuerpo.message;
  } catch {
    return null;
  }
};

const generar = async () => {
  const f = form.value;
  generando.value = true;
  try {
    const pdf = await reporteService.rendimientoPdf({
      grado_id: f.grado_id,
      seccion_id: f.seccion_id,
      periodo_escolar_id: f.periodo_id,
      asignacion_id: f.asignacion_id,
      profesor: f.profesor,
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

// Solo lectura: el PDF lleva la fecha del día en que se genera (la pone el backend)
const fechaHoy = fechaLegible(hoy());
const etiqueta = "block text-sm text-gray-600 mb-1";
const entrada =
  "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
const conIcono = `${entrada} pl-10`;
const icono = "pi absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
const boton = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm";
</script>

<template>
  <form class="bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Reporte de Rendimiento</h2>
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
            <option v-for="p in periodosDelNivel" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
        </span>
      </label>
      <label class="block">
        <span :class="etiqueta">Asignatura</span>
        <span class="relative block">
          <i :class="[icono, 'pi-book']"></i>
          <select v-model="form.asignacion_id" :class="conIcono" required>
            <option value="" disabled>Seleccione una asignatura</option>
            <option v-for="m in materias" :key="m.asignacion_id" :value="m.asignacion_id">{{ m.nombre }}</option>
          </select>
        </span>
      </label>
      <label class="block">
        <span :class="etiqueta">Profesor responsable</span>
        <input v-model.trim="form.profesor" :class="entrada" placeholder="Ingrese el nombre del profesor" required />
      </label>
      <label class="block">
        <span :class="etiqueta">Fecha</span>
        <input :value="fechaHoy" :class="[entrada, 'bg-gray-50']" readonly title="El reporte lleva la fecha del día en que se genera" />
      </label>
    </div>

    <p v-if="cargando" class="mt-5 text-sm text-gray-500"><i class="pi pi-spin pi-spinner mr-2"></i>Cargando...</p>

    <template v-else-if="notas && form.asignacion_id && alumnos.length">
      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left font-semibold text-gray-800">Alumno</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-800">Calificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in alumnos" :key="a.id">
              <td class="px-4 py-2.5 text-gray-700">{{ a.nombre }}</td>
              <td class="px-4 py-2.5 font-semibold text-blue-600">{{ nota(a.calificacion) }}</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-4 py-3 font-semibold text-gray-800">Promedio General</td>
              <td class="px-4 py-3 font-bold text-green-600">{{ promedioGeneral }}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2 text-xs text-gray-500">
          Cada calificación es el promedio de la boleta del período; "—" si aún no se genera la libreta de esta materia.
        </p>
      </div>

      <div class="mt-5 rounded-xl bg-green-50 p-4">
        <p class="text-sm font-medium text-green-700 mb-3">Estudiantes Destacados (Promedio ≥ {{ NOTA_DESTACADO.toFixed(1) }})</p>
        <div v-for="a in destacados" :key="a.id" class="mb-2 flex justify-between rounded-lg bg-white px-3 py-2 text-sm">
          <span class="text-gray-700">{{ a.nombre }}</span>
          <span class="font-semibold text-green-600">{{ nota(a.calificacion) }}</span>
        </div>
        <p v-if="!destacados.length" class="text-sm text-gray-500">Ningún estudiante alcanza el promedio.</p>
      </div>
    </template>

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
      <span>Estas observaciones aparecerán en el reporte.</span>
      <span>{{ form.observaciones.length }}/{{ MAX_OBSERVACIONES }}</span>
    </div>

    <div class="mt-8 flex flex-wrap justify-end gap-3">
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="limpiar">
        <i class="pi pi-refresh"></i>Limpiar
      </button>
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="emit('cerrar')">
        <i class="pi pi-times"></i>Cancelar
      </button>
      <button type="submit" :disabled="!alumnos.length || generando" :class="[boton, 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
        <i :class="['pi', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Reporte
      </button>
    </div>
  </form>
</template>

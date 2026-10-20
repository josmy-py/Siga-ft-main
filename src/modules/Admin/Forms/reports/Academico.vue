<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { reporteService } from "@/services/reporteService";
import { seccionService } from "@/services/seccionService";
import { dato, fechaLegible, fila, hoy, imprimirReporte, porcentaje, seccion, texto } from "@/components/reportes/documentoReporte";

// Portal director > Reportes > Reporte Académico (formulario de Josmy, 20/10/2026).
// No se guarda en la base de datos: "Generar Reporte" arma el documento con lo
// llenado y abre la impresión del navegador para guardarlo como PDF.
// Los indicadores y las asignaturas se precargan con las boletas del periodo
// (reporte de notas existente) y quedan editables.
const emit = defineEmits(["cerrar"]);
const auth = useAuthStore();

// Misma nota mínima de aprobación que el backend (PromocionService::NOTA_MINIMA)
const NOTA_MINIMA = 7;
const NIVELES = ["Parvularia", "Educación Básica", "Bachillerato"];
const CARGOS = ["Director"];

const nivelDeGrado = (orden) => {
  if (orden === null || orden === undefined) return null;
  if (orden <= 0) return "Parvularia";
  if (orden <= 9) return "Educación Básica";
  return "Bachillerato";
};

const form = ref({
  nivel: "",
  periodo_id: "",
  fecha: hoy(),
  director: "",
  correo: auth.user?.email ?? "",
  cargo: "Director",
  total_estudiantes: "",
  promedio_general: "",
  porcentaje_aprobacion: "",
  porcentaje_reprobacion: "",
  rendimiento: "",
  mejor_asignatura: "",
  menor_asignatura: "",
  destacados: "",
  recomendaciones: "",
  observaciones: "",
});

const secciones = ref([]);
const periodos = ref([]);
const calculando = ref(false);
const avisoIndicadores = ref("");

const nivelesDisponibles = computed(() => NIVELES.filter((n) => secciones.value.some((s) => s.nivel === n)));
const periodoActual = computed(() => periodos.value.find((p) => String(p.id) === String(form.value.periodo_id)));

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

onMounted(async () => {
  try {
    const { secciones: lista = [] } = await seccionService.listar();
    secciones.value = lista.map((s) => ({ id: s.id, anio_lectivo_id: s.anio_lectivo_id, nivel: nivelDeGrado(s.grado?.orden) }));
    form.value.nivel = nivelesDisponibles.value[0] ?? "";
    const anioId = lista[0]?.anio_lectivo_id;
    if (anioId) {
      periodos.value = await reporteService.periodos(anioId);
      form.value.periodo_id = periodos.value[0]?.id ?? "";
    }
  } catch (e) {
    avisoIndicadores.value = mensaje(e, "No se pudieron cargar las secciones y los periodos del año activo.");
  }
});

// Indicadores del nivel en el periodo, a partir del reporte de notas de cada sección
const calcularIndicadores = async () => {
  const delNivel = secciones.value.filter((s) => s.nivel === form.value.nivel);
  if (!delNivel.length || !form.value.periodo_id) return;
  calculando.value = true;
  avisoIndicadores.value = "";
  try {
    const reportes = await Promise.all(delNivel.map((s) => reporteService.notas("director", s.id, form.value.periodo_id)));
    const estudiantes = reportes.flatMap((r) => r.estudiantes ?? []);
    const conNota = estudiantes.filter((e) => e.promedio !== null && e.promedio !== undefined);

    const materias = {};
    reportes.forEach((r) => {
      (r.estudiantes ?? []).forEach((e) => {
        (r.materias ?? []).forEach((m) => {
          const valor = e.promedios?.[m.asignacion_id];
          if (valor === null || valor === undefined) return;
          materias[m.nombre] ??= [];
          materias[m.nombre].push(Number(valor));
        });
      });
    });
    const promediosMaterias = Object.entries(materias)
      .map(([nombre, notas]) => ({ nombre, promedio: notas.reduce((a, b) => a + b, 0) / notas.length }))
      .sort((a, b) => b.promedio - a.promedio);

    form.value.total_estudiantes = estudiantes.length;
    if (conNota.length) {
      const aprobados = conNota.filter((e) => Number(e.promedio) >= NOTA_MINIMA).length;
      const promedio = conNota.reduce((a, e) => a + Number(e.promedio), 0) / conNota.length;
      form.value.promedio_general = promedio.toFixed(2);
      form.value.porcentaje_aprobacion = ((aprobados / conNota.length) * 100).toFixed(1);
      form.value.porcentaje_reprobacion = (100 - (aprobados / conNota.length) * 100).toFixed(1);
    } else {
      form.value.promedio_general = "";
      form.value.porcentaje_aprobacion = "";
      form.value.porcentaje_reprobacion = "";
      avisoIndicadores.value = "Aún no hay boletas de este periodo; los indicadores se pueden llenar a mano.";
    }
    if (promediosMaterias.length) {
      const mejor = promediosMaterias[0];
      const menor = promediosMaterias[promediosMaterias.length - 1];
      form.value.mejor_asignatura = `${mejor.nombre} (${mejor.promedio.toFixed(2)})`;
      form.value.menor_asignatura = `${menor.nombre} (${menor.promedio.toFixed(2)})`;
    }
  } catch (e) {
    avisoIndicadores.value = mensaje(e, "No se pudieron calcular los indicadores; se pueden llenar a mano.");
  } finally {
    calculando.value = false;
  }
};

watch(() => [form.value.nivel, form.value.periodo_id], calcularIndicadores);

const generar = () => {
  const f = form.value;
  imprimirReporte({
    titulo: "Reporte Académico",
    subtitulo: "Registro y consolidación de información académica y administrativa.",
    cuerpo: [
      seccion("Identificación", fila(dato("Nivel Académico", f.nivel), dato("Período", periodoActual.value?.nombre_periodo), dato("Fecha", fechaLegible(f.fecha)))),
      seccion("Responsable", fila(dato("Nombre del Director", f.director), dato("Correo Electrónico", f.correo), dato("Cargo", f.cargo))),
      seccion(
        "Indicadores Académicos",
        fila(
          dato("Total Estudiantes", f.total_estudiantes),
          dato("Promedio General", f.promedio_general),
          dato("% Aprobación", porcentaje(f.porcentaje_aprobacion)),
          dato("% Reprobación", porcentaje(f.porcentaje_reprobacion)),
        ),
      ),
      seccion("Rendimiento Académico", texto(f.rendimiento)),
      seccion(
        "Asignaturas con Mayor y Menor Rendimiento",
        fila(dato("Asignatura con mejor rendimiento", f.mejor_asignatura), dato("Asignatura con menor rendimiento", f.menor_asignatura)),
      ),
      seccion("Estudiantes Destacados", texto(f.destacados)),
      seccion("Recomendaciones Académicas", texto(f.recomendaciones)),
      seccion("Observaciones Generales", texto(f.observaciones)),
    ].join(""),
    firma: [f.director, f.cargo],
  });
};

const entrada =
  "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400";
const area = `${entrada} h-24 resize-y`;
const subtitulo = "flex items-center gap-2 text-lg font-semibold text-gray-700 mt-8 mb-3";
</script>

<template>
  <div>
    <div class="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-white shadow-md">
      <h1 class="text-2xl font-bold">Reporte Académico</h1>
      <p class="mt-3 text-sm text-indigo-100">Registro y consolidación de información académica y administrativa.</p>
    </div>

    <form class="mt-6 bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg bg-violet-100 flex items-center justify-center">
          <i class="pi pi-chart-line text-violet-600"></i>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Reporte Académico</h2>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-building text-indigo-500"></i>Identificación</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span class="block text-sm text-gray-600 mb-1">Nivel Académico</span>
          <select v-model="form.nivel" :class="entrada" required>
            <option value="" disabled>Seleccione</option>
            <option v-for="n in NIVELES" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <label class="block">
          <span class="block text-sm text-gray-600 mb-1">Período</span>
          <select v-model="form.periodo_id" :class="entrada" required>
            <option value="" disabled>{{ periodos.length ? "Seleccione" : "Sin periodos" }}</option>
            <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre_periodo }}</option>
          </select>
        </label>
        <label class="block">
          <span class="block text-sm text-gray-600 mb-1">Fecha</span>
          <input v-model="form.fecha" type="date" :class="entrada" required />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-user text-green-500"></i>Responsable</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model.trim="form.director" :class="entrada" placeholder="Nombre del Director" required />
        <input v-model.trim="form.correo" type="email" :class="entrada" placeholder="Correo Electrónico" required />
        <select v-model="form.cargo" :class="entrada">
          <option v-for="c in CARGOS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <h3 :class="subtitulo">
        <i class="pi pi-chart-bar text-violet-500"></i>Indicadores Académicos
        <i v-if="calculando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">Total Estudiantes</span>
          <input v-model="form.total_estudiantes" type="number" min="0" :class="entrada" placeholder="Total Estudiantes" />
        </label>
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">Promedio General</span>
          <input v-model="form.promedio_general" type="number" min="0" max="10" step="0.01" :class="entrada" placeholder="Promedio General" />
        </label>
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">% Aprobación</span>
          <input v-model="form.porcentaje_aprobacion" type="number" min="0" max="100" step="0.1" :class="entrada" placeholder="% Aprobación" />
        </label>
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">% Reprobación</span>
          <input v-model="form.porcentaje_reprobacion" type="number" min="0" max="100" step="0.1" :class="entrada" placeholder="% Reprobación" />
        </label>
      </div>
      <p v-if="avisoIndicadores" class="mt-2 text-xs text-amber-700">{{ avisoIndicadores }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">
        Se calculan con las boletas del periodo (aprobado con promedio de {{ NOTA_MINIMA }} o más); se pueden corregir.
      </p>

      <h3 :class="subtitulo"><i class="pi pi-book text-blue-500"></i>Rendimiento Académico</h3>
      <textarea v-model="form.rendimiento" :class="area" placeholder="Describa el rendimiento académico general observado durante el período..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-list text-orange-500"></i>Asignaturas con Mayor y Menor Rendimiento</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">Asignatura con mejor rendimiento</span>
          <input v-model="form.mejor_asignatura" :class="entrada" placeholder="Asignatura con mejor rendimiento" />
        </label>
        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">Asignatura con menor rendimiento</span>
          <input v-model="form.menor_asignatura" :class="entrada" placeholder="Asignatura con menor rendimiento" />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-star-fill text-yellow-500"></i>Estudiantes Destacados</h3>
      <textarea v-model="form.destacados" :class="area" placeholder="Listado o descripción de estudiantes destacados..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-lightbulb text-amber-500"></i>Recomendaciones Académicas</h3>
      <textarea v-model="form.recomendaciones" :class="area" placeholder="Acciones y recomendaciones para mejorar el rendimiento académico..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-comment text-gray-500"></i>Observaciones Generales</h3>
      <textarea v-model="form.observaciones" :class="area" placeholder="Observaciones adicionales..."></textarea>

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

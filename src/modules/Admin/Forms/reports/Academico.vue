<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { reporteService } from "@/services/reporteService";
import { seccionService } from "@/services/seccionService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";

// Portal director > Reportes > Reporte Académico (formulario y diseño de PDF de
// Josmy, 20/10/2026). El backend calcula los indicadores y las materias con las
// boletas del período del nivel elegido (aprueba con 7) y genera el PDF con
// dompdf; aquí se muestran solo como consulta. No se guarda en la base de datos.
const emit = defineEmits(["cerrar"]);
// El PDF lleva la fecha del día en que se genera (la pone el backend)
const fechaHoy = fechaLegible(hoy());
const auth = useAuthStore();

const NIVELES = ["Parvularia", "Educación Básica", "Bachillerato"];
const CARGOS = ["Director", "Directora"];

const nivelDeGrado = (orden) => {
  if (orden === null || orden === undefined) return null;
  if (orden <= 0) return "Parvularia";
  if (orden <= 9) return "Educación Básica";
  return "Bachillerato";
};

const form = ref({
  nivel: "",
  periodo_id: "",
  director: "",
  correo: auth.user?.email ?? "",
  cargo: "Director",
  rendimiento: "",
  destacados: "",
  recomendaciones: "",
  observaciones: "",
});

const indicadores = ref(null);
const periodos = ref([]);
// Periodos del nivel académico elegido (periodo_escolares.nivel: 1 Parvularia y Básica, 2 Bachillerato)
const periodosDelNivel = computed(() => {
  const nivel = form.value.nivel === "Bachillerato" ? 2 : 1;
  return periodos.value.filter((p) => Number(p.nivel) === nivel);
});
watch(
  () => form.value.nivel,
  () => {
    if (!periodosDelNivel.value.some((p) => p.id === form.value.periodo_id)) form.value.periodo_id = periodosDelNivel.value[0]?.id ?? "";
  },
);
const calculando = ref(false);
const generando = ref(false);
const avisoIndicadores = ref("");

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;
const numero = (v) => (v === null || v === undefined ? "—" : String(Number(Number(v).toFixed(2))));
const porcentaje = (v) => (v === null || v === undefined ? "—" : `${numero(v)} %`);

onMounted(async () => {
  try {
    const { secciones: lista = [] } = await seccionService.listar();
    const niveles = new Set(lista.map((s) => nivelDeGrado(s.grado?.orden)));
    form.value.nivel = NIVELES.find((n) => niveles.has(n)) ?? "";
    const anioId = lista[0]?.anio_lectivo_id;
    if (anioId) {
      periodos.value = await reporteService.periodos(anioId);
      form.value.periodo_id = periodosDelNivel.value[0]?.id ?? "";
    }
  } catch (e) {
    avisoIndicadores.value = mensaje(e, "No se pudieron cargar los periodos del año activo.");
  }
});

// Los mismos indicadores que imprime el PDF
watch(
  () => [form.value.nivel, form.value.periodo_id],
  async ([nivel, periodoId]) => {
    indicadores.value = null;
    if (!nivel || !periodoId) return;
    calculando.value = true;
    avisoIndicadores.value = "";
    try {
      indicadores.value = await reporteService.academicoIndicadores(nivel, periodoId);
      if (!indicadores.value.estudiantes_evaluados) avisoIndicadores.value = "Aún no hay boletas de este período en el nivel elegido.";
    } catch (e) {
      avisoIndicadores.value = mensaje(e, "No se pudieron calcular los indicadores.");
    } finally {
      calculando.value = false;
    }
  },
);

// Mensaje de error de una respuesta pedida como blob (422, 404...)
const errorDeBlob = async (e) => {
  try {
    return JSON.parse(await e.response.data.text()).message;
  } catch {
    return null;
  }
};

const generar = async () => {
  const f = form.value;
  generando.value = true;
  try {
    const pdf = await reporteService.academicoPdf({
      nivel: f.nivel,
      periodo_escolar_id: f.periodo_id,
      nombre: f.director,
      cargo: f.cargo,
      correo: f.correo,
      rendimiento_academico: f.rendimiento,
      estudiantes_destacados: f.destacados,
      recomendaciones: f.recomendaciones,
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
            <option value="" disabled>{{ periodosDelNivel.length ? "Seleccione" : "Sin periodos" }}</option>
            <option v-for="p in periodosDelNivel" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
        </label>
        <label class="block">
          <span class="block text-sm text-gray-600 mb-1">Fecha</span>
          <input :value="fechaHoy" :class="[entrada, 'bg-gray-50']" readonly title="El reporte lleva la fecha del día en que se genera" />
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
          <span :class="etiqueta">Total Estudiantes</span>
          <input :value="indicadores ? indicadores.total_estudiantes : '—'" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">Promedio General</span>
          <input :value="numero(indicadores?.promedio_general)" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">% Aprobación</span>
          <input :value="porcentaje(indicadores?.porcentaje_aprobacion)" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">% Reprobación</span>
          <input :value="porcentaje(indicadores?.porcentaje_reprobacion)" :class="soloLectura" readonly />
        </label>
      </div>
      <p v-if="avisoIndicadores" class="mt-2 text-xs text-amber-700">{{ avisoIndicadores }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">
        Se calculan con las boletas del período del nivel elegido (aprobado con promedio de 7 o más), igual que en el PDF.
      </p>

      <h3 :class="subtitulo"><i class="pi pi-book text-blue-500"></i>Rendimiento Académico</h3>
      <textarea v-model="form.rendimiento" :class="area" placeholder="Describa el rendimiento académico general observado durante el período..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-list text-orange-500"></i>Asignaturas con Mayor y Menor Rendimiento</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Asignatura con mayor rendimiento</span>
          <input :value="indicadores?.materia_mayor ?? '—'" :class="soloLectura" readonly />
        </label>
        <label class="block">
          <span :class="etiqueta">Asignatura con menor rendimiento</span>
          <input :value="indicadores?.materia_menor ?? '—'" :class="soloLectura" readonly />
        </label>
      </div>

      <h3 :class="subtitulo"><i class="pi pi-star-fill text-yellow-500"></i>Estudiantes Destacados</h3>
      <textarea v-model="form.destacados" :class="area" placeholder="Un estudiante por línea, por ejemplo: Ana López - Sexto Grado"></textarea>

      <h3 :class="subtitulo"><i class="pi pi-lightbulb text-amber-500"></i>Recomendaciones Académicas</h3>
      <textarea v-model="form.recomendaciones" :class="area" placeholder="Una recomendación por línea..."></textarea>

      <h3 :class="subtitulo"><i class="pi pi-comment text-gray-500"></i>Observaciones Generales</h3>
      <textarea v-model="form.observaciones" :class="area" placeholder="Observaciones adicionales..."></textarea>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          Cancelar
        </button>
        <button type="submit" :disabled="generando" class="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
          <i :class="['pi mr-2', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Reporte
        </button>
      </div>
    </form>
  </div>
</template>

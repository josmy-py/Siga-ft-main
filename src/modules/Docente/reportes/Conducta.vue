<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { asignacionService } from "@/services/asignacionService";
import { conductaService } from "@/services/conductaService";
import { reporteService } from "@/services/reporteService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";
import { periodosDelGrado } from "@/services/nivelAcademico";

// Portal docente > Reportes > Conducta (formulario y diseño de PDF de Josmy,
// 21/10/2026). Grado, sección y período salen de la carga académica del docente;
// los estudiantes son los de matrícula aprobada de la sección. El profesor es el
// docente que inició sesión. El tipo de conducta son valores fijos de este
// formulario (pedido de Josmy) y se imprime en el PDF. "Generar Reporte" abre el
// PDF que arma el backend con dompdf. No se guarda en la base de datos.
const emit = defineEmits(["cerrar"]);
const MAX_ACCIONES = 500;
const TIPOS_CONDUCTA = ["Excelente", "Muy buena", "Buena", "Regular", "Mala", "Muy mala", "Necesita mejorar"];

const carga = ref([]); // [{ id, nombre, grado_id, grado }]
const periodos = ref([]);
const nombreProfesor = ref("");
const estudiantes = ref([]); // [{ matricula_id, estudiante, conducta }]
const cargando = ref(false);
const generando = ref(false);
const aviso = ref("");

const inicial = () => ({
  grado_id: "",
  seccion_id: "",
  periodo_id: "",
  profesor: nombreProfesor.value,
  matricula_id: "",
  tipo: "",
  descripcion: "",
  acciones: "",
  compromisos: "",
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
const estudianteActual = computed(() => estudiantes.value.find((e) => String(e.matricula_id) === String(form.value.matricula_id)));

onMounted(async () => {
  try {
    const datos = await asignacionService.miCarga();
    nombreProfesor.value = datos.profesor?.nombre ?? "";
    form.value.profesor = nombreProfesor.value;
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

// Estudiantes de la sección con su conducta registrada en el período
watch(
  () => [form.value.seccion_id, form.value.periodo_id],
  async ([seccionId, periodoId]) => {
    estudiantes.value = [];
    form.value.matricula_id = "";
    if (!seccionId || !periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      const datos = await conductaService.listar(seccionId, periodoId);
      estudiantes.value = datos.estudiantes ?? [];
      if (!estudiantes.value.length) aviso.value = "La sección no tiene estudiantes con matrícula aprobada.";
    } catch (e) {
      aviso.value = e.response?.data?.message ?? "No se pudieron cargar los estudiantes de la sección.";
    } finally {
      cargando.value = false;
    }
  },
);

// Al elegir estudiante se precarga la descripción de su conducta registrada en el período
watch(
  () => form.value.matricula_id,
  () => {
    form.value.descripcion = estudianteActual.value?.conducta?.descripcion ?? "";
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
    const pdf = await reporteService.conductaPdf({
      grado_id: f.grado_id,
      seccion_id: f.seccion_id,
      periodo_escolar_id: f.periodo_id,
      matricula_id: f.matricula_id,
      conducta: f.tipo,
      descripcion_hechos: f.descripcion,
      acciones_tomadas: f.acciones,
      compromiso_mejora: f.compromisos,
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
const subtitulo = "flex items-center gap-2 text-xl font-semibold text-gray-800 mt-6 mb-3";
const boton = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm";
</script>

<template>
  <form class="bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
    <p v-if="aviso" class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ aviso }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <label class="block">
        <span :class="etiqueta">Grado</span>
        <select v-model="form.grado_id" :class="entrada" required>
          <option value="" disabled>Selecciona un grado</option>
          <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
        </select>
      </label>
      <label class="block">
        <span :class="etiqueta">Sección</span>
        <select v-model="form.seccion_id" :class="entrada" required>
          <option value="" disabled>Selecciona una sección</option>
          <option v-for="s in seccionesDelGrado" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </label>
      <label class="block">
        <span :class="etiqueta">Período</span>
        <select v-model="form.periodo_id" :class="entrada" required>
          <option value="" disabled>Selecciona un período</option>
          <option v-for="p in periodosDelNivel" :key="p.id" :value="p.id">{{ p.nombre }}</option>
        </select>
      </label>
      <label class="block">
        <span :class="etiqueta">Profesor responsable</span>
        <input :value="form.profesor" :class="[entrada, 'bg-gray-50']" readonly title="Docente que inició sesión" />
      </label>
      <label class="block">
        <span :class="etiqueta">Fecha</span>
        <input :value="fechaHoy" :class="[entrada, 'bg-gray-50']" readonly title="El reporte lleva la fecha del día en que se genera" />
      </label>
    </div>

    <h3 :class="subtitulo">
      <i class="pi pi-user text-base"></i>Estudiante
      <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
    </h3>
    <select v-model="form.matricula_id" :class="entrada" required>
      <option value="" disabled>{{ estudiantes.length || !form.seccion_id ? "Selecciona un estudiante" : "Sin estudiantes" }}</option>
      <option v-for="e in estudiantes" :key="e.matricula_id" :value="e.matricula_id">{{ e.estudiante?.nombre }}</option>
    </select>

    <label class="block mt-5">
      <span :class="etiqueta">Tipo de conducta</span>
      <select v-model="form.tipo" :class="entrada" required>
        <option value="" disabled>Seleccione la conducta</option>
        <option v-for="t in TIPOS_CONDUCTA" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>
    <p v-if="estudianteActual?.conducta" class="mt-1 text-xs text-gray-500">
      Conducta registrada en el período: {{ estudianteActual.conducta.valoracion }}. La descripción se precargó y se puede editar.
    </p>

    <label class="block mt-5">
      <span :class="etiqueta">Descripción de los hechos</span>
      <textarea v-model="form.descripcion" :class="[entrada, 'h-24 resize-y']" maxlength="1000" placeholder="Describe lo ocurrido..." required></textarea>
    </label>

    <label class="block mt-5">
      <span class="block text-sm font-semibold text-gray-800 mb-2">Acciones tomadas previamente</span>
      <textarea v-model="form.acciones" :maxlength="MAX_ACCIONES" :class="[entrada, 'h-24 resize-y']" placeholder="Acciones disciplinarias aplicadas..." required></textarea>
    </label>
    <div class="mt-1 flex justify-between text-xs text-gray-500">
      <span>Medidas aplicadas: una por línea (en el PDF salen como lista)</span>
      <span>{{ form.acciones.length }}/{{ MAX_ACCIONES }}</span>
    </div>

    <label class="block mt-5">
      <span class="block text-sm font-semibold text-gray-800 mb-2">Compromisos de Mejora</span>
      <textarea v-model="form.compromisos" :class="[entrada, 'h-20 resize-y']" maxlength="1000" placeholder="Escriba el compromiso del estudiante..." required></textarea>
    </label>

    <div class="mt-8 flex flex-wrap justify-end gap-3">
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="limpiar">
        <i class="pi pi-refresh"></i>Limpiar
      </button>
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="emit('cerrar')">
        <i class="pi pi-times"></i>Cancelar
      </button>
      <button type="submit" :disabled="!estudianteActual || generando" :class="[boton, 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
        <i :class="['pi', generando ? 'pi-spin pi-spinner' : 'pi-check']"></i>Generar Reporte
      </button>
    </div>
  </form>
</template>

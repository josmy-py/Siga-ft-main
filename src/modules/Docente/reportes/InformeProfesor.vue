<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { asignacionService } from "@/services/asignacionService";
import { reporteService } from "@/services/reporteService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";
import { periodosDelGrado } from "@/services/nivelAcademico";

// Portal docente > Reportes > Informe Profesor (formulario de Josmy, 20/10/2026).
// Grado, sección y período salen de la carga académica del docente que inició
// sesión; el nombre del profesor se precarga y es editable. "Generar Informe"
// abre el PDF que arma el backend con dompdf (diseño de Josmy, 21/10/2026); el
// backend vuelve a validar que la sección sea del docente. No se guarda en la
// base de datos.
const emit = defineEmits(["cerrar"]);
// El PDF lleva la fecha del día en que se genera (la pone el backend)
const fechaHoy = fechaLegible(hoy());

const carga = ref([]); // [{ id, nombre, grado_id, grado }]
const periodos = ref([]);
const nombreProfesor = ref("");
const aviso = ref("");
const generando = ref(false);

const inicial = () => ({
  grado_id: "",
  seccion_id: "",
  profesor: nombreProfesor.value,
  periodo_id: "",
  asunto: "",
  desarrollo: "",
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
watch(
  () => form.value.grado_id,
  () => {
    if (!seccionesDelGrado.value.some((s) => String(s.id) === String(form.value.seccion_id))) form.value.seccion_id = "";
  },
);

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

const limpiar = () => {
  form.value = inicial();
};

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
    const pdf = await reporteService.informeProfesorPdf({
      grado_id: f.grado_id,
      seccion_id: f.seccion_id,
      periodo_escolar_id: f.periodo_id,
      profesor: f.profesor,
      asunto: f.asunto,
      desarrollo: f.desarrollo,
      observaciones: f.observaciones,
    });
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    Swal.fire({ icon: "error", title: (await errorDeBlob(e)) ?? "No se pudo generar el informe." });
  } finally {
    generando.value = false;
  }
};

const etiqueta = "block text-sm font-semibold text-gray-700 mb-1";
const entrada =
  "w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
const boton = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm";
</script>

<template>
  <form class="bg-white rounded-2xl shadow-sm p-6 lg:p-8" @submit.prevent="generar">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Generar Informe Profesor</h2>
    <p v-if="aviso" class="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ aviso }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <label class="block">
        <span :class="etiqueta">Fecha</span>
        <input :value="fechaHoy" :class="[entrada, 'bg-gray-50']" readonly title="El reporte lleva la fecha del día en que se genera" />
      </label>
      <label class="block">
        <span :class="etiqueta">Grado</span>
        <select v-model="form.grado_id" :class="entrada" required>
          <option value="" disabled>Seleccione un grado</option>
          <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
        </select>
      </label>
      <label class="block">
        <span :class="etiqueta">Sección</span>
        <select v-model="form.seccion_id" :class="entrada" required>
          <option value="" disabled>Seleccione una sección</option>
          <option v-for="s in seccionesDelGrado" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </label>
      <label class="block">
        <span :class="etiqueta">Prof. Responsable</span>
        <input v-model.trim="form.profesor" :class="entrada" placeholder="Ingrese el nombre del profesor" required />
      </label>
      <label class="block">
        <span :class="etiqueta">Período Académico</span>
        <select v-model="form.periodo_id" :class="entrada" required>
          <option value="" disabled>Seleccione un período</option>
          <option v-for="p in periodosDelNivel" :key="p.id" :value="p.id">{{ p.nombre }}</option>
        </select>
      </label>
    </div>

    <label class="block mt-5">
      <span :class="etiqueta">Asunto</span>
      <input v-model.trim="form.asunto" :class="entrada" placeholder="Ingrese el asunto" required />
    </label>

    <label class="block mt-5">
      <span :class="etiqueta">Desarrollo del Informe</span>
      <textarea v-model="form.desarrollo" :class="[entrada, 'h-28 resize-y']" placeholder="Describa las actividades realizadas..." required></textarea>
    </label>

    <label class="block mt-5">
      <span :class="etiqueta">Observaciones</span>
      <textarea v-model="form.observaciones" :class="[entrada, 'h-16 resize-y']"></textarea>
    </label>

    <div class="mt-8 flex flex-wrap justify-end gap-3">
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="limpiar">
        <i class="pi pi-refresh"></i>Limpiar
      </button>
      <button type="button" :class="[boton, 'bg-gray-100 text-gray-700 hover:bg-gray-200']" @click="emit('cerrar')">
        <i class="pi pi-times"></i>Cancelar
      </button>
      <button type="submit" :disabled="generando" :class="[boton, 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
        <i :class="['pi', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Informe
      </button>
    </div>
  </form>
</template>

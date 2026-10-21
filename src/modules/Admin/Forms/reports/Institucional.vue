<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { reporteService } from "@/services/reporteService";
import { asignacionService } from "@/services/asignacionService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";

// Portal director > Reportes > Reporte Institucional (formulario de Josmy,
// 21/10/2026). Por Nivel Académico y período salen de la base, y aquí solo se
// muestran: total de estudiantes (matrícula total), promedio general, destacados
// (promedio >= 9) y reprobados (< 7) según las boletas del período, nuevos
// ingresos y total de docentes con carga en el nivel. Conducta, actividades,
// docentes ausentes y textos no existen en el sistema y se llenan a mano. No se
// guarda en la base de datos. La fecha es solo de lectura (el PDF lleva la del
// día en que se genera) y el correo es el de la cuenta. El backend genera el PDF
// con dompdf con las mismas secciones del formulario.
const emit = defineEmits(["cerrar"]);
const auth = useAuthStore();
const NIVELES = ["Parvularia", "Educación Básica", "Bachillerato"];
const CARGOS = ["Director", "Directora"];
const ACTIVIDADES = ["Acto Cívico", "Feria Científica", "Torneo Deportivo", "Actividad Cultural"];
const fechaHoy = fechaLegible(hoy());

const form = ref({
  nivel: "Educación Básica",
  periodo_id: "",
  director: "",
  cargo: "Director",
  descripcion_calificaciones: "",
  incidentes: "",
  reportes_leves: "",
  reportes_graves: "",
  medidas_aplicadas: "",
  descripcion_casos: "",
  total_actividades: "",
  total_proyectos: "",
  actividades: [],
  descripcion_actividades: "",
  docentes_ausentes: "",
  observaciones: "",
});

const periodos = ref([]);
const indicadores = ref(null);
const cargando = ref(false);
const generando = ref(false);
const aviso = ref("");

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;
const valor = (campo) => (indicadores.value ? indicadores.value[campo] ?? "—" : "—");

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

// Indicadores del nivel en el período
watch(
  () => [form.value.nivel, form.value.periodo_id],
  async ([nivel, periodoId]) => {
    indicadores.value = null;
    if (!nivel || !periodoId) return;
    cargando.value = true;
    aviso.value = "";
    try {
      indicadores.value = await reporteService.institucionalIndicadores(nivel, periodoId);
      if (!indicadores.value.estudiantes_evaluados) aviso.value = "Aún no hay boletas de este período en el nivel elegido.";
    } catch (e) {
      aviso.value = mensaje(e, "No se pudieron calcular los indicadores del nivel.");
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
    const pdf = await reporteService.institucionalPdf({
      nivel: f.nivel,
      periodo_escolar_id: f.periodo_id,
      nombre: f.director,
      cargo: f.cargo,
      descripcion_calificaciones: f.descripcion_calificaciones,
      incidentes: vacioANull(f.incidentes),
      reportes_leves: vacioANull(f.reportes_leves),
      reportes_graves: vacioANull(f.reportes_graves),
      medidas_aplicadas: vacioANull(f.medidas_aplicadas),
      descripcion_casos: f.descripcion_casos,
      total_actividades: f.total_actividades,
      total_proyectos: f.total_proyectos,
      actividades: f.actividades,
      descripcion_actividades: f.descripcion_actividades,
      docentes_ausentes: f.docentes_ausentes,
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
const area = `${entrada} h-24 resize-y mt-4`;
const tarjeta = "mt-6 bg-white rounded-2xl shadow-sm p-6";
const etiqueta = "block text-xs text-gray-500 mb-1";
const icono = "w-11 h-11 rounded-lg flex items-center justify-center shrink-0";
</script>

<template>
  <div>
    <div class="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-white shadow-md">
      <h1 class="text-2xl font-bold">Reporte Institucional</h1>
      <p class="mt-3 text-sm text-indigo-100">Información general del informe institucional.</p>
    </div>

    <form @submit.prevent="generar">
      <section :class="tarjeta">
        <div class="flex items-center gap-3">
          <div :class="[icono, 'bg-indigo-100']"><i class="pi pi-building text-indigo-600"></i></div>
          <h2 class="text-lg font-semibold text-gray-800">Informe Institucional</h2>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="block">
            <span :class="etiqueta">Nivel Académico</span>
            <select v-model="form.nivel" :class="entrada" required>
              <option v-for="n in NIVELES" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
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
        </div>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-emerald-100']"><i class="pi pi-user text-emerald-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Datos del Director</h2>
            <p class="text-sm text-gray-500">Información del responsable institucional.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="block">
            <span :class="etiqueta">Nombre Completo</span>
            <input v-model.trim="form.director" :class="entrada" maxlength="100" placeholder="Nombre Completo" required />
          </label>
          <label class="block">
            <span :class="etiqueta">Cargo</span>
            <select v-model="form.cargo" :class="entrada">
              <option v-for="c in CARGOS" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <label class="block">
            <span :class="etiqueta">Correo Electrónico</span>
            <input :value="auth.user?.email" :class="soloLectura" readonly title="Correo de la cuenta que genera el reporte" />
          </label>
        </div>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-violet-100']"><i class="pi pi-chart-line text-violet-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              Rendimiento Académico <i v-if="cargando" class="pi pi-spin pi-spinner text-sm text-gray-400"></i>
            </h2>
            <p class="text-sm text-gray-500">Resultados académicos del período.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="block">
            <span :class="etiqueta">Total de Estudiantes</span>
            <input :value="valor('total_estudiantes')" :class="soloLectura" readonly />
          </label>
          <label class="block">
            <span :class="etiqueta">Promedio General</span>
            <input :value="valor('promedio_general')" :class="soloLectura" readonly />
          </label>
          <label class="block">
            <span :class="etiqueta">Estudiantes Destacados</span>
            <input :value="valor('estudiantes_destacados')" :class="soloLectura" readonly />
          </label>
        </div>
        <p v-if="aviso" class="mt-2 text-xs text-amber-700">{{ aviso }}</p>
        <p v-else class="mt-2 text-xs text-gray-500">
          Matrículas aprobadas del nivel; promedio y destacados (promedio de 9 o más) según las boletas del período.
        </p>
        <textarea v-model="form.descripcion_calificaciones" :class="area" maxlength="3000" placeholder="Descripción general de calificaciones..."></textarea>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-red-100']"><i class="pi pi-shield text-red-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Conducta y Disciplina</h2>
            <p class="text-sm text-gray-500">Seguimiento conductual estudiantil.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block">
            <span :class="etiqueta">Incidentes</span>
            <input v-model="form.incidentes" type="number" min="0" :class="entrada" placeholder="Incidentes" />
          </label>
          <label class="block">
            <span :class="etiqueta">Reportes Leves</span>
            <input v-model="form.reportes_leves" type="number" min="0" :class="entrada" placeholder="Reportes Leves" />
          </label>
          <label class="block">
            <span :class="etiqueta">Reportes Graves</span>
            <input v-model="form.reportes_graves" type="number" min="0" :class="entrada" placeholder="Reportes Graves" />
          </label>
          <label class="block">
            <span :class="etiqueta">Medidas Aplicadas</span>
            <input v-model="form.medidas_aplicadas" type="number" min="0" :class="entrada" placeholder="Medidas Aplicadas" />
          </label>
        </div>
        <textarea v-model="form.descripcion_casos" :class="area" maxlength="3000" placeholder="Descripción de casos importantes..."></textarea>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-amber-100']"><i class="pi pi-calendar-plus text-amber-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Actividades Institucionales</h2>
            <p class="text-sm text-gray-500">Eventos y proyectos desarrollados.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block">
            <span :class="etiqueta">Total de Actividades</span>
            <input v-model="form.total_actividades" type="number" min="0" :class="entrada" placeholder="Total de Actividades" required />
          </label>
          <label class="block">
            <span :class="etiqueta">Total de Proyectos</span>
            <input v-model="form.total_proyectos" type="number" min="0" :class="entrada" placeholder="Total de Proyectos" required />
          </label>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <label v-for="a in ACTIVIDADES" :key="a" class="flex items-center gap-2 text-sm text-gray-700">
            <input v-model="form.actividades" type="checkbox" :value="a" class="h-4 w-4 rounded border-gray-300" />{{ a }}
          </label>
        </div>
        <textarea v-model="form.descripcion_actividades" :class="area" maxlength="3000" placeholder="Descripción detallada de actividades y proyectos..."></textarea>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-cyan-100']"><i class="pi pi-book text-cyan-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Control Escolar</h2>
            <p class="text-sm text-gray-500">Información de matrícula y rendimiento.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="block">
            <span :class="etiqueta">Matrícula Total</span>
            <input :value="valor('total_estudiantes')" :class="soloLectura" readonly />
          </label>
          <label class="block">
            <span :class="etiqueta">Nuevos Ingresos</span>
            <input :value="valor('nuevos_ingresos')" :class="soloLectura" readonly />
          </label>
          <label class="block">
            <span :class="etiqueta">Estudiantes Reprobados</span>
            <input :value="valor('estudiantes_reprobados')" :class="soloLectura" readonly />
          </label>
        </div>
        <p class="mt-2 text-xs text-gray-500">Nuevos ingresos = matrículas de tipo Nuevo ingreso; reprobados = promedio del período menor que 7.</p>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-sky-100']"><i class="pi pi-users text-sky-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Recursos Humanos</h2>
            <p class="text-sm text-gray-500">Información del personal docente.</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block">
            <span :class="etiqueta">Total de Docentes</span>
            <input :value="valor('total_docentes')" :class="soloLectura" readonly />
          </label>
          <label class="block">
            <span :class="etiqueta">Docentes Ausentes</span>
            <input v-model="form.docentes_ausentes" type="number" min="0" :max="indicadores?.total_docentes" :class="entrada" placeholder="Docentes Ausentes" required />
          </label>
        </div>
        <p class="mt-2 text-xs text-gray-500">Total de docentes = docentes con carga académica en el nivel durante el año del período.</p>
      </section>

      <section :class="tarjeta">
        <div class="flex items-start gap-3">
          <div :class="[icono, 'bg-gray-100']"><i class="pi pi-comment text-gray-600"></i></div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Observaciones Generales</h2>
            <p class="text-sm text-gray-500">Comentarios adicionales del reporte.</p>
          </div>
        </div>
        <textarea v-model="form.observaciones" :class="area" maxlength="3000" placeholder="Escriba observaciones generales..."></textarea>
      </section>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          <i class="pi pi-times mr-2"></i>Cancelar
        </button>
        <button type="submit" :disabled="!indicadores || generando" class="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
          <i :class="['pi mr-2', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Reporte
        </button>
      </div>
    </form>
  </div>
</template>

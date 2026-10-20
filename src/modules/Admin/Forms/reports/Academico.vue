<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { reporteService } from "@/services/reporteService";
import { seccionService } from "@/services/seccionService";

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

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

const escapar = (texto) =>
  String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fechaLegible = (iso) => {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

const documento = () => {
  const f = form.value;
  const dato = (etiqueta, valor) => `<div class="dato"><span>${etiqueta}</span><strong>${escapar(valor) || "—"}</strong></div>`;
  const texto = (titulo, valor) => `<h2>${titulo}</h2><p class="texto">${escapar(valor) || "—"}</p>`;
  const porcentaje = (v) => (v === "" || v === null ? "" : `${v} %`);

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Reporte Académico</title>
<style>
  body { font-family: Arial, sans-serif; color: #1f2937; margin: 32px; font-size: 13px; }
  .encabezado { background: linear-gradient(90deg, #4f46e5, #7c3aed); color: #fff; padding: 18px 22px; border-radius: 10px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .encabezado h1 { margin: 0 0 4px; font-size: 22px; }
  .encabezado p { margin: 0; font-size: 12px; }
  h2 { font-size: 15px; color: #4c1d95; border-bottom: 1px solid #ddd6fe; padding-bottom: 4px; margin: 22px 0 10px; }
  .fila { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .fila.dos { grid-template-columns: repeat(2, 1fr); }
  .fila.cuatro { grid-template-columns: repeat(4, 1fr); }
  .dato { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; }
  .dato span { display: block; font-size: 11px; color: #6b7280; }
  .texto { white-space: pre-wrap; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; min-height: 40px; margin: 0; }
  .pie { margin-top: 40px; font-size: 11px; color: #6b7280; text-align: center; }
  .firma { margin: 60px auto 0; width: 260px; border-top: 1px solid #374151; text-align: center; padding-top: 6px; }
</style></head><body>
<div class="encabezado"><h1>Reporte Académico</h1><p>Registro y consolidación de información académica y administrativa.</p></div>
<h2>Identificación</h2>
<div class="fila">${dato("Nivel Académico", f.nivel)}${dato("Período", periodoActual.value?.nombre_periodo)}${dato("Fecha", fechaLegible(f.fecha))}</div>
<h2>Responsable</h2>
<div class="fila">${dato("Nombre del Director", f.director)}${dato("Correo Electrónico", f.correo)}${dato("Cargo", f.cargo)}</div>
<h2>Indicadores Académicos</h2>
<div class="fila cuatro">${dato("Total Estudiantes", f.total_estudiantes)}${dato("Promedio General", f.promedio_general)}${dato("% Aprobación", porcentaje(f.porcentaje_aprobacion))}${dato("% Reprobación", porcentaje(f.porcentaje_reprobacion))}</div>
${texto("Rendimiento Académico", f.rendimiento)}
<h2>Asignaturas con Mayor y Menor Rendimiento</h2>
<div class="fila dos">${dato("Asignatura con mejor rendimiento", f.mejor_asignatura)}${dato("Asignatura con menor rendimiento", f.menor_asignatura)}</div>
${texto("Estudiantes Destacados", f.destacados)}
${texto("Recomendaciones Académicas", f.recomendaciones)}
${texto("Observaciones Generales", f.observaciones)}
<div class="firma">${escapar(f.director)}<br>${escapar(f.cargo)}</div>
<div class="pie">Generado por SIGA el ${fechaLegible(hoy())}</div>
</body></html>`;
};

const generar = () => {
  const ventana = window.open("", "_blank");
  if (!ventana) {
    Swal.fire({ icon: "warning", title: "Permita las ventanas emergentes para generar el PDF." });
    return;
  }
  ventana.document.open();
  ventana.document.write(documento());
  ventana.document.close();
  ventana.focus();
  setTimeout(() => ventana.print(), 300);
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

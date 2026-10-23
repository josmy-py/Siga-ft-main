<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import { asignacionService } from "@/services/asignacionService";
import { seccionService, TURNOS } from "@/services/seccionService";
import { planEstudioService, asignaturaService } from "@/services/catalogoService";
import { mensajeError } from "@/services/api";

// M4 (tesis, pág. 65): el director elige un docente, marca los grados y las
// materias de cada sección, y al guardar se crean o quitan las asignaciones.
// Solo se ofrecen materias del plan vigente del grado (D-A1: un plan por sección)
// y no se ofrecen las que ya imparte otro docente (D-A2).
const props = defineProps({
  anio: { type: Object, required: true },
  docenteInicial: { type: Object, default: null },
  // Docentes con cuenta activa
  docentes: { type: Array, default: () => [] },
  // Asignaciones del año (de todos los docentes)
  asignaciones: { type: Array, default: () => [] },
});

const emit = defineEmits(["cerrar", "guardado", "cambio"]);

const filtros = ref({
  profesor: props.docenteInicial?.id ?? "",
});

const secciones = ref([]);
const planes = ref([]);
const asignaturas = ref([]);
const cargando = ref(true);
const guardando = ref(false);
const errorGeneral = ref(null);

const gradosSeleccionados = ref([]);
// Claves "seccion-asignatura" marcadas para el docente
const seleccion = ref(new Set());
// Plan elegido a mano en secciones con varios planes vigentes y sin materias aún
const planElegido = ref({});

const clave = (seccionId, asignaturaId) => `${seccionId}-${asignaturaId}`;
const etiquetaTurno = (valor) => TURNOS.find((t) => t.valor === valor)?.etiqueta ?? valor;
const asignaturaPorId = computed(() => new Map(asignaturas.value.map((a) => [a.id, a])));

const propias = computed(() => props.asignaciones.filter((a) => a.profesor_id === Number(filtros.value.profesor)));
const deOtros = computed(() =>
  new Map(
    props.asignaciones
      .filter((a) => a.profesor_id !== Number(filtros.value.profesor))
      .map((a) => [clave(a.seccion_id, a.asignatura_id), a])
  )
);

// Grados con secciones en el año, en el orden académico que trae la API
const grados = computed(() => {
  const vistos = new Map();
  for (const s of secciones.value) if (!vistos.has(s.grado_id)) vistos.set(s.grado_id, s.grado);
  return [...vistos.entries()].map(([id, grado]) => ({ id, nombre: grado?.nombre ?? `Grado ${id}` }));
});

const reiniciarSeleccion = () => {
  seleccion.value = new Set(propias.value.map((a) => clave(a.seccion_id, a.asignatura_id)));
  gradosSeleccionados.value = [...new Set(propias.value.map((a) => a.seccion?.grado_id))];
  planElegido.value = {};
  errorGeneral.value = null;
};

watch(() => filtros.value.profesor, reiniciarSeleccion);

onMounted(async () => {
  try {
    const [respuestaSecciones, vigentes, respuestaAsignaturas] = await Promise.all([
      seccionService.listar({ anio_lectivo_id: props.anio.id }),
      planEstudioService.listar({ vigente: 1 }),
      asignaturaService.getAll(),
    ]);
    secciones.value = respuestaSecciones.secciones;
    planes.value = vigentes;
    asignaturas.value = respuestaAsignaturas.asignaturas;
    reiniciarSeleccion();
  } catch (error) {
    errorGeneral.value = mensajeError(error, "No se pudieron cargar las secciones y los planes de estudio");
  } finally {
    cargando.value = false;
  }
});

const toggleGrado = (gradoId) => {
  const i = gradosSeleccionados.value.indexOf(gradoId);
  if (i >= 0) gradosSeleccionados.value.splice(i, 1);
  else gradosSeleccionados.value.push(gradoId);
};

const marcadasEn = (seccionId) =>
  [...seleccion.value].filter((k) => k.startsWith(`${seccionId}-`)).map((k) => Number(k.split("-")[1]));

// Plan de cada sección: el de las materias de otros docentes (fijo), el elegido,
// el de las materias marcadas o, si hay uno solo vigente, ese
const vistaSecciones = computed(() =>
  secciones.value
    .filter((s) => gradosSeleccionados.value.includes(s.grado_id))
    .map((s) => {
      const opciones = planes.value;
      const otros = props.asignaciones.filter((a) => a.seccion_id === s.id && a.profesor_id !== Number(filtros.value.profesor));
      const planFijo = otros[0]?.asignatura?.plan_estudio_id ?? null;
      const planMarcado = marcadasEn(s.id)
        .map((id) => asignaturaPorId.value.get(id)?.plan_estudio_id)
        .find(Boolean);
      const planId = planFijo ?? planElegido.value[s.id] ?? planMarcado ?? (opciones.length === 1 ? opciones[0].id : null);

      const materias = asignaturas.value.filter((a) => a.plan_estudio_id === planId);
      // Materias propias de un plan que ya no está vigente: se muestran para no quitarlas sin querer
      for (const a of propias.value.filter((p) => p.seccion_id === s.id)) {
        if (!materias.some((m) => m.id === a.asignatura_id)) materias.push({ ...a.asignatura, antigua: true });
      }

      return {
        seccion: s,
        opciones,
        planId,
        planFijo: !!planFijo,
        plan: opciones.find((p) => p.id === planId) ?? otros[0]?.asignatura?.plan_estudio ?? null,
        materias: materias.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      };
    })
);

const totalMarcadas = computed(() => seleccion.value.size);

const toggleMateria = (seccionId, asignaturaId) => {
  const k = clave(seccionId, asignaturaId);
  const nueva = new Set(seleccion.value);
  nueva.has(k) ? nueva.delete(k) : nueva.add(k);
  seleccion.value = nueva;
};

const elegirPlan = (seccionId, planId) => {
  planElegido.value = { ...planElegido.value, [seccionId]: Number(planId) };
  // Al cambiar de plan se desmarcan las materias del plan anterior en esa sección
  seleccion.value = new Set(
    [...seleccion.value].filter((k) => {
      const [s, a] = k.split("-").map(Number);
      return s !== seccionId || asignaturaPorId.value.get(a)?.plan_estudio_id === Number(planId);
    })
  );
};

// D-A3: pasar a este docente una materia que hoy imparte otro, conservando sus notas
const reasignar = async (asignacion) => {
  const docente = props.docentes.find((d) => d.id === Number(filtros.value.profesor));
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    title: "¿Cambiar el docente de la materia?",
    text: `${asignacion.asignatura?.nombre} de ${asignacion.seccion?.grado?.nombre} ${asignacion.seccion?.nombre} pasará de ${asignacion.profesor?.nombre} a ${docente?.nombre}. Sus evaluaciones y notas se conservan.`,
    showCancelButton: true,
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await asignacionService.cambiarDocente(asignacion.id, docente.id);
    seleccion.value = new Set([...seleccion.value, clave(asignacion.seccion_id, asignacion.asignatura_id)]);
    emit("cambio");
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo cambiar el docente") });
  }
};

const guardarAsignacion = async () => {
  errorGeneral.value = null;
  if (!filtros.value.profesor) {
    errorGeneral.value = "Seleccione un profesor.";
    return;
  }
  guardando.value = true;
  try {
    const items = [...seleccion.value].map((k) => {
      const [seccion_id, asignatura_id] = k.split("-").map(Number);
      return { seccion_id, asignatura_id };
    });
    const respuesta = await asignacionService.guardarCarga(filtros.value.profesor, props.anio.id, items);
    emit("guardado", `${respuesta.message}: ${respuesta.creadas} agregada(s), ${respuesta.eliminadas} quitada(s)`);
  } catch (error) {
    const errores = error?.response?.data?.errors;
    errorGeneral.value = errores ? Object.values(errores).flat()[0] : mensajeError(error, "No se pudo guardar la carga académica");
  } finally {
    guardando.value = false;
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <section
      class="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm"
    >
      <div
        class="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"
      ></div>

      <div class="relative p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-user text-white text-2xl"></i>
            </div>

            <div>
              <h2 class="text-xl font-bold text-slate-800">Profesor Encargado</h2>

              <p class="text-slate-500 text-sm">
                Seleccione el docente responsable de la asignación académica
              </p>
            </div>
          </div>

          <div
            class="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl"
          >
            <i class="pi pi-calendar"></i>
            Año lectivo {{ anio.anio }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-slate-700"> Profesor </label>

          <div class="relative">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

            <select
              v-model="filtros.profesor"
              class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all"
            >
              <option value="">Seleccione un profesor</option>

              <option v-for="docente in docentes" :key="docente.id" :value="docente.id">
                {{ docente.codigo }} · {{ docente.nombre }}
              </option>
            </select>
          </div>

          <p class="text-xs text-slate-400">
            El docente recibirá las materias marcadas en cada sección. Desmarcar una materia la quita de su carga.
          </p>
        </div>
      </div>
    </section>

    <div v-if="errorGeneral" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      {{ errorGeneral }}
    </div>

    <p v-if="cargando" class="text-center text-slate-500">Cargando secciones y planes de estudio...</p>

    <div v-else-if="filtros.profesor" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden self-start">
        <div class="p-5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <i class="pi pi-graduation-cap text-blue-600 text-xl"></i>
            </div>

            <div>
              <h3 class="font-bold text-slate-800">Grados</h3>
              <p class="text-sm text-slate-500">Seleccione los grados asignados</p>
            </div>
          </div>
        </div>

        <div class="p-5">
          <p v-if="!grados.length" class="text-sm text-amber-600">
            No hay secciones en {{ anio.anio }}. Créelas en Catálogos &gt; Secciones.
          </p>
          <div class="grid gap-3">
            <label
              v-for="grado in grados"
              :key="grado.id"
              :class="[
                'relative cursor-pointer rounded-2xl border-2 p-4 py-2 transition-all duration-200',
                gradosSeleccionados.includes(grado.id)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50',
              ]"
            >
              <input type="checkbox" :checked="gradosSeleccionados.includes(grado.id)" @change="toggleGrado(grado.id)" class="hidden" />

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-slate-800">{{ grado.nombre }}</p>
                  <p class="text-xs text-slate-500 mt-1">
                    {{ secciones.filter((s) => s.grado_id === grado.id).length }} sección(es)
                  </p>
                </div>

                <div
                  v-if="gradosSeleccionados.includes(grado.id)"
                  class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"
                >
                  <i class="pi pi-check text-white text-sm"></i>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      <div class="xl:col-span-2 space-y-6">
        <p v-if="!vistaSecciones.length" class="p-6 bg-white rounded-3xl border border-slate-200 text-slate-500 text-center">
          Seleccione uno o más grados para ver sus secciones y materias.
        </p>

        <section
          v-for="vista in vistaSecciones"
          :key="vista.seccion.id"
          class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <i class="pi pi-users text-violet-600 text-xl"></i>
              </div>

              <div>
                <h3 class="font-bold text-slate-800">{{ vista.seccion.grado?.nombre }} {{ vista.seccion.nombre }}</h3>
                <p class="text-sm text-slate-500">
                  {{ etiquetaTurno(vista.seccion.turno) }} · Responsable: {{ vista.seccion.profesor?.nombre ?? "—" }}
                </p>
              </div>
            </div>

            <div class="text-sm">
              <select
                v-if="vista.opciones.length > 1 && !vista.planFijo"
                :value="vista.planId ?? ''"
                @change="elegirPlan(vista.seccion.id, $event.target.value)"
                class="h-10 px-3 border border-slate-300 rounded-xl"
              >
                <option value="" disabled>Elija el plan de la sección</option>
                <option v-for="plan in vista.opciones" :key="plan.id" :value="plan.id">
                  {{ plan.nombre }}{{ plan.especialidad ? ` · ${plan.especialidad.nombre}` : "" }}
                </option>
              </select>
              <span v-else-if="vista.plan" class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Plan: {{ vista.plan.nombre }}{{ vista.plan.especialidad ? ` · ${vista.plan.especialidad.nombre}` : "" }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <p v-if="!vista.opciones.length && !vista.materias.length" class="text-sm text-amber-600">
              No hay planes de estudio vigentes. Regístrelos en Catálogos &gt; Planes de estudio.
            </p>
            <p v-else-if="!vista.planId" class="text-sm text-slate-500">Elija el plan de estudios de la sección para ver sus materias.</p>
            <p v-else-if="!vista.materias.length" class="text-sm text-amber-600">
              El plan {{ vista.plan?.nombre }} no tiene materias. Agréguelas en Catálogos &gt; Planes de estudio.
            </p>
            <p v-if="vista.planFijo && vista.opciones.length > 1" class="text-xs text-slate-500 mb-3">
              La sección ya tiene materias de este plan con otros docentes: no se mezclan planes ni especialidades.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <template v-for="materia in vista.materias" :key="materia.id">
                <div
                  v-if="deOtros.has(`${vista.seccion.id}-${materia.id}`)"
                  class="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 py-2"
                >
                  <p class="font-semibold text-slate-500">{{ materia.nombre }}</p>
                  <p class="text-xs text-slate-500 mt-1">
                    Imparte: {{ deOtros.get(`${vista.seccion.id}-${materia.id}`).profesor?.nombre }}
                  </p>
                  <button
                    type="button"
                    @click="reasignar(deOtros.get(`${vista.seccion.id}-${materia.id}`))"
                    class="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Pasar a este docente
                  </button>
                </div>

                <label
                  v-else
                  :class="[
                    'relative cursor-pointer rounded-2xl border-2 p-4 py-2 transition-all duration-200',
                    seleccion.has(`${vista.seccion.id}-${materia.id}`)
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50',
                  ]"
                >
                  <input
                    type="checkbox"
                    :checked="seleccion.has(`${vista.seccion.id}-${materia.id}`)"
                    @change="toggleMateria(vista.seccion.id, materia.id)"
                    class="hidden"
                  />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-semibold text-slate-800">{{ materia.nombre }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ materia.antigua ? "Plan anterior" : "Asignatura" }}</p>
                    </div>

                    <div
                      v-if="seleccion.has(`${vista.seccion.id}-${materia.id}`)"
                      class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"
                    >
                      <i class="pi pi-check text-white text-sm"></i>
                    </div>
                  </div>
                </label>
              </template>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="flex flex-wrap justify-end items-center gap-3">
      <span v-if="filtros.profesor" class="text-sm text-slate-500 mr-auto">{{ totalMarcadas }} materia(s) marcada(s) para el docente</span>
      <button
        @click="emit('cerrar')"
        class="px-4 border border-gray-500 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl transition"
      >
        Cancelar
      </button>

      <button
        @click="guardarAsignacion"
        :disabled="guardando || cargando || !filtros.profesor"
        class="px-5 py-3 bg-green-500 border border-green-500 text-white rounded-xl disabled:opacity-60"
      >
        {{ guardando ? "Guardando..." : "Guardar Asignación" }}
      </button>
    </div>
  </div>
</template>

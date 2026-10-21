<script setup>
// M4: carga académica de los docentes por año lectivo (tesis, pág. 65).
// Cada tarjeta resume la carga real de un docente; el formulario marca y desmarca
// materias por sección y la guarda de una vez.
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import Asignacion from "@/modules/Admin/Forms/Asignaciones.vue";
import { asignacionService } from "@/services/asignacionService";
import { anioLectivoService } from "@/services/calendarioService";
import { profesorService } from "@/services/profesorService";
import { mensajeError } from "@/services/api";

const anios = ref([]);
const anioId = ref("");
const docentes = ref([]);
const asignaciones = ref([]);
const cargando = ref(false);
const errorCarga = ref(null);

const mostrarAsignacion = ref(false);
const docenteEditado = ref(null);
const docenteDetalle = ref(null);

const anioSeleccionado = computed(() => anios.value.find((a) => a.id === Number(anioId.value)));
const anioCerrado = computed(() => anioSeleccionado.value?.estado === "cierre");

// Docentes con cuenta activa, más los que tienen carga aunque su cuenta ya no lo esté
const tarjetas = computed(() => {
  const porDocente = new Map();
  for (const a of asignaciones.value) {
    if (!porDocente.has(a.profesor_id)) porDocente.set(a.profesor_id, []);
    porDocente.get(a.profesor_id).push(a);
  }
  return docentes.value
    .filter((d) => !!d.user || porDocente.has(d.id))
    .map((d) => {
      const carga = porDocente.get(d.id) ?? [];
      return {
        docente: d,
        activo: !!d.user,
        carga,
        grados: new Set(carga.map((a) => a.seccion?.grado_id)).size,
        materias: carga.length,
        secciones: new Set(carga.map((a) => a.seccion_id)).size,
      };
    })
    .sort((a, b) => b.materias - a.materias || a.docente.codigo.localeCompare(b.docente.codigo));
});

const cargarAsignaciones = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const respuesta = await asignacionService.listar({ anio_lectivo_id: anioId.value });
    asignaciones.value = respuesta.asignaciones;
    if (!anioId.value && respuesta.anio_lectivo_id) anioId.value = respuesta.anio_lectivo_id;
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar las asignaciones");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    const [listaAnios, profesores] = await Promise.all([anioLectivoService.listar(), profesorService.listar()]);
    anios.value = listaAnios;
    docentes.value = profesores;
    if (!listaAnios.some((a) => a.estado === "activo")) {
      anioId.value = listaAnios.find((a) => a.estado !== "cierre")?.id ?? listaAnios[0]?.id ?? "";
    }
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los docentes y años lectivos");
  }
  await cargarAsignaciones();
});

const abrirAsignacion = (docente = null) => {
  docenteEditado.value = docente;
  docenteDetalle.value = null;
  mostrarAsignacion.value = true;
};

const cerrarAsignacion = () => {
  mostrarAsignacion.value = false;
  docenteEditado.value = null;
};

const alGuardar = async (mensaje) => {
  cerrarAsignacion();
  await cargarAsignaciones();
  Swal.fire({ icon: "success", title: mensaje, timer: 2500, showConfirmButton: false });
};

const verDetalle = (tarjeta) => {
  docenteDetalle.value = docenteDetalle.value === tarjeta.docente.id ? null : tarjeta.docente.id;
};

// Quitar toda la carga del año: no procede si alguna materia ya tiene notas
const liberarCarga = async (tarjeta) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Quitar toda la carga académica?",
    text: `Se quitarán las ${tarjeta.materias} materias de ${tarjeta.docente.nombre} en ${anioSeleccionado.value?.anio}. No es posible si alguna ya tiene evaluaciones o notas.`,
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await asignacionService.guardarCarga(tarjeta.docente.id, anioId.value, []);
    await cargarAsignaciones();
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo quitar la carga académica") });
  }
};

const etiquetaSeccion = (a) => `${a.seccion?.grado?.nombre ?? ""} ${a.seccion?.nombre ?? ""}`.trim();
</script>

<template>
  <div class="relative min-h-screen bg-slate-100 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class=" bg-white border-b border-slate-200 shadow-sm">
        <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-slate-800">Asignaciones Académicas</h1>

            <p class="text-sm text-slate-500">Carga académica de cada docente por año lectivo</p>
          </div>

          <div v-if="!mostrarAsignacion" class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-600">Año lectivo</label>
            <select v-model="anioId" @change="cargarAsignaciones" class="h-11 px-3 border border-slate-300 rounded-xl bg-white">
              <option v-for="anio in anios" :key="anio.id" :value="anio.id">
                {{ anio.anio }}{{ anio.estado === "activo" ? " (activo)" : anio.estado === "cierre" ? " (cerrado)" : " (inactivo)" }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <div class="p-6">
        <div v-if="!mostrarAsignacion">
          <div v-if="errorCarga" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorCarga }}
          </div>
          <div v-else-if="!anios.length && !cargando" class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            No hay años lectivos. Créelos primero en Años lectivos.
          </div>
          <div v-else-if="anioCerrado" class="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm">
            El año lectivo {{ anioSeleccionado.anio }} está cerrado: su carga académica solo se puede consultar.
          </div>

          <div class="flex justify-between items-center mb-6">
            <p class="text-sm text-slate-500">
              {{ asignaciones.length }} materias asignadas en {{ anioSeleccionado?.anio ?? "—" }}
            </p>
            <button
              v-if="!anioCerrado && anioSeleccionado"
              @click="abrirAsignacion()"
              title="Asignar carga académica"
              class="flex border border-transparent items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition"
            >
              <i class="pi pi-plus"></i>
              Asignar carga
            </button>
          </div>

          <p v-if="cargando && !tarjetas.length" class="text-center text-slate-500 py-6">Cargando asignaciones...</p>
          <p v-else-if="!tarjetas.length" class="text-center text-slate-500 py-6">No hay docentes con cuenta activa.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="tarjeta in tarjetas"
              :key="tarjeta.docente.id"
              class="bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200"
            >
              <div class="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500"></div>

              <div class="p-5">
                <div class="flex items-center gap-4 mb-5">
                  <div class="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <i class="pi pi-user text-blue-600 text-2xl"></i>
                  </div>

                  <div>
                    <h3 class="font-bold text-slate-800 text-lg">{{ tarjeta.docente.nombre }}</h3>

                    <p class="text-sm text-slate-500">
                      {{ tarjeta.docente.codigo }}
                      <span v-if="!tarjeta.activo" class="text-amber-600">· sin cuenta DOCENTE</span>
                      <span v-else-if="!tarjeta.materias" class="text-slate-400">· sin carga</span>
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <i class="pi pi-graduation-cap text-blue-600"></i>

                    <span class="text-slate-700 font-medium"> Grados </span>

                    <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs"> {{ tarjeta.grados }} </span>
                  </div>

                  <div class="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                    <i class="pi pi-book text-green-500"></i>

                    <span class="text-slate-700 font-medium"> Materias </span>

                    <span class="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs">
                      {{ tarjeta.materias }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3">
                    <i class="pi pi-th-large text-violet-500"></i>

                    <span class="text-slate-700 font-medium"> Secciones </span>

                    <span class="px-3 py-1 rounded-full bg-violet-600 text-white text-xs"> {{ tarjeta.secciones }} </span>
                  </div>
                </div>

                <ul v-if="docenteDetalle === tarjeta.docente.id" class="mt-4 space-y-2 text-sm">
                  <li v-if="!tarjeta.carga.length" class="text-slate-500">Sin materias asignadas en este año.</li>
                  <li
                    v-for="a in tarjeta.carga"
                    :key="a.id"
                    class="flex justify-between gap-3 border-b border-slate-100 pb-1"
                  >
                    <span class="text-slate-700">{{ a.asignatura?.nombre }}</span>
                    <span class="text-slate-500 text-right">
                      {{ etiquetaSeccion(a) }}
                      <i v-if="a.evaluaciones_count || a.boletas_count" class="pi pi-lock text-xs ml-1" title="Tiene evaluaciones o notas"></i>
                    </span>
                  </li>
                </ul>
              </div>

              <div class="grid gap-3 p-4 bg-slate-50 border-t border-slate-200" :class="anioCerrado ? 'grid-cols-1' : 'grid-cols-3'">
                <button
                  @click="verDetalle(tarjeta)"
                  title="Ver materias"
                  class="py-3 border border-gray-500 rounded-2xl hover:bg-gray-300 transition"
                >
                  <i class="pi pi-eye"></i>
                </button>

                <button
                  v-if="!anioCerrado"
                  @click="abrirAsignacion(tarjeta.docente)"
                  :disabled="!tarjeta.activo"
                  :title="tarjeta.activo ? 'Editar carga académica' : 'El docente no tiene cuenta DOCENTE'"
                  class="py-3 rounded-2xl border border-transparent bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-50"
                >
                  <i class="pi pi-pencil"></i>
                </button>

                <button
                  v-if="!anioCerrado"
                  @click="liberarCarga(tarjeta)"
                  :disabled="!tarjeta.materias"
                  title="Quitar toda la carga del año"
                  class="py-3 rounded-2xl bg-red-500 border border-transparent hover:bg-red-600 text-white transition disabled:opacity-50"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Asignacion
          v-if="mostrarAsignacion"
          :anio="anioSeleccionado"
          :docente-inicial="docenteEditado"
          :docentes="docentes.filter((d) => !!d.user)"
          :asignaciones="asignaciones"
          @cerrar="cerrarAsignacion"
          @guardado="alGuardar"
          @cambio="cargarAsignaciones"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import FormSeccion from "../Forms/Seccion.vue";
import { seccionService, TURNOS } from "@/services/seccionService";
import { anioLectivoService } from "@/services/calendarioService";
import { gradoService } from "@/services/catalogoService";
import { profesorService } from "@/services/profesorService";
import { mensajeError } from "@/services/api";

const secciones = ref([]);
const anios = ref([]);
const grados = ref([]);
const docentes = ref([]);

// Sin año elegido el backend devuelve el año activo
const filtros = ref({ anio_lectivo_id: "", grado_id: "", turno: "" });

const cargando = ref(false);
const errorCarga = ref(null);
const mostrarModal = ref(false);
const seccionEditada = ref(null);

const anioSeleccionado = computed(() => anios.value.find((a) => a.id === Number(filtros.value.anio_lectivo_id)));
const anioCerrado = computed(() => anioSeleccionado.value?.estado === "cierre");
const aniosAbiertos = computed(() => anios.value.filter((a) => a.estado !== "cierre"));
const etiquetaTurno = (valor) => TURNOS.find((t) => t.valor === valor)?.etiqueta ?? valor;

const totales = computed(() => ({
  capacidad: secciones.value.reduce((s, x) => s + x.capacidad, 0),
  matriculados: secciones.value.reduce((s, x) => s + x.matriculados, 0),
}));

const cargarSecciones = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const respuesta = await seccionService.listar(filtros.value);
    secciones.value = respuesta.secciones;
    // Muestra en el filtro el año que usó el backend (el activo, si no se eligió)
    if (!filtros.value.anio_lectivo_id && respuesta.anio_lectivo_id) {
      filtros.value.anio_lectivo_id = respuesta.anio_lectivo_id;
    }
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar las secciones");
  } finally {
    cargando.value = false;
  }
};

const cargarCatalogos = async () => {
  try {
    const [listaAnios, respuestaGrados, profesores] = await Promise.all([
      anioLectivoService.listar(),
      gradoService.getAll(),
      profesorService.listar(),
    ]);
    anios.value = listaAnios;
    grados.value = respuestaGrados.grados;
    docentes.value = profesores
      .filter((p) => !!p.user)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los catálogos");
  }
};

onMounted(async () => {
  await Promise.all([cargarCatalogos(), cargarSecciones()]);
});

const abrirCrear = () => {
  seccionEditada.value = null;
  mostrarModal.value = true;
};

const abrirEditar = (seccion) => {
  seccionEditada.value = seccion;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  seccionEditada.value = null;
};

const alGuardar = async (mensaje) => {
  cerrarModal();
  await cargarSecciones();
  Swal.fire({ icon: "success", title: mensaje, timer: 2500, showConfirmButton: false });
};

const eliminar = async (seccion) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar la sección?",
    text: `Se eliminará ${seccion.grado?.nombre} ${seccion.nombre}. Solo es posible si no tiene estudiantes ni materias asignadas.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await seccionService.eliminar(seccion.id);
    await cargarSecciones();
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo eliminar la sección") });
  }
};

const porcentaje = (s) => Math.min(100, Math.round((s.matriculados / s.capacidad) * 100));
const claseOcupacion = (s) =>
  s.cupos_disponibles === 0 ? "bg-red-500" : porcentaje(s) >= 80 ? "bg-amber-500" : "bg-green-500";
</script>

<template>
  <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-wrap items-end gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Secciones</h2>
        <p class="text-gray-500 text-sm">Grupos por grado, turno y año lectivo, con su ocupación.</p>
      </div>

      <button
        @click="abrirCrear"
        :disabled="anioCerrado || !aniosAbiertos.length"
        class="ml-auto h-11 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :title="anioCerrado ? 'El año lectivo seleccionado está cerrado' : ''"
      >
        + Nueva sección
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Año lectivo</label>
        <select v-model="filtros.anio_lectivo_id" @change="cargarSecciones" class="w-full h-11 px-3 border border-slate-300 rounded-lg">
          <option v-if="!anios.some((a) => a.estado === 'activo')" value="">Todos los años</option>
          <option v-for="anio in anios" :key="anio.id" :value="anio.id">
            {{ anio.nombre }}{{ anio.estado === "activo" ? " (activo)" : anio.estado === "cierre" ? " (cerrado)" : "" }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Grado</label>
        <select v-model="filtros.grado_id" @change="cargarSecciones" class="w-full h-11 px-3 border border-slate-300 rounded-lg">
          <option value="">Todos los grados</option>
          <option v-for="grado in grados" :key="grado.id" :value="grado.id">{{ grado.nombre }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Turno</label>
        <select v-model="filtros.turno" @change="cargarSecciones" class="w-full h-11 px-3 border border-slate-300 rounded-lg">
          <option value="">Ambos turnos</option>
          <option v-for="turno in TURNOS" :key="turno.valor" :value="turno.valor">{{ turno.etiqueta }}</option>
        </select>
      </div>
    </div>

    <div v-if="errorCarga" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      {{ errorCarga }}
    </div>
    <div v-else-if="!anios.length && !cargando" class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
      No hay años lectivos. Créelos primero en Años lectivos.
    </div>
    <div v-else-if="anioCerrado" class="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm">
      El año lectivo {{ anioSeleccionado.nombre }} está cerrado: sus secciones solo se pueden consultar.
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border-collapse">
        <thead>
          <tr>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Grado</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Sección</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Turno</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Docente responsable</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Ocupación</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Cupos libres</th>
            <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="cargando && !secciones.length">
            <td colspan="7" class="text-center py-6 text-slate-500">Cargando secciones...</td>
          </tr>
          <tr v-else-if="!secciones.length">
            <td colspan="7" class="text-center py-6 text-slate-500">No hay secciones con estos filtros.</td>
          </tr>

          <tr v-for="seccion in secciones" :key="seccion.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 border-b border-slate-200 text-slate-700">{{ seccion.grado?.nombre }}</td>
            <td class="px-4 py-3 border-b border-slate-200 text-slate-800 font-semibold">{{ seccion.nombre }}</td>
            <td class="px-4 py-3 border-b border-slate-200 text-slate-700">{{ etiquetaTurno(seccion.turno) }}</td>
            <td class="px-4 py-3 border-b border-slate-200 text-slate-700">
              {{ seccion.profesor?.nombre }}
              <span class="text-slate-400 text-sm">{{ seccion.profesor?.codigo }}</span>
            </td>
            <td class="px-4 py-3 border-b border-slate-200 text-slate-700 min-w-[180px]">
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div class="h-full rounded-full" :class="claseOcupacion(seccion)" :style="{ width: porcentaje(seccion) + '%' }"></div>
                </div>
                <span class="text-sm whitespace-nowrap">{{ seccion.matriculados }} / {{ seccion.capacidad }}</span>
              </div>
            </td>
            <td class="px-4 py-3 border-b border-slate-200">
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="seccion.cupos_disponibles === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              >
                {{ seccion.cupos_disponibles === 0 ? "Llena" : seccion.cupos_disponibles }}
              </span>
            </td>
            <td class="px-4 py-3 border-b border-slate-200">
              <div v-if="!anioCerrado" class="flex flex-wrap gap-2">
                <button
                  @click="abrirEditar(seccion)"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                >
                  <i class="pi pi-pencil"></i>
                  Editar
                </button>
                <button
                  @click="eliminar(seccion)"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                >
                  <i class="pi pi-trash"></i>
                  Eliminar
                </button>
              </div>
              <span v-else class="text-slate-400 text-sm">Solo consulta</span>
            </td>
          </tr>
        </tbody>

        <tfoot v-if="secciones.length">
          <tr>
            <td colspan="4" class="px-4 py-3 text-right text-slate-600 font-semibold">Total</td>
            <td colspan="3" class="px-4 py-3 text-slate-700 font-semibold">
              {{ totales.matriculados }} / {{ totales.capacidad }} estudiantes
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <FormSeccion
      v-if="mostrarModal"
      :seccion="seccionEditada"
      :anios="aniosAbiertos"
      :grados="grados"
      :docentes="docentes"
      :anio-por-defecto="anioCerrado ? '' : filtros.anio_lectivo_id"
      @cerrar="cerrarModal"
      @guardado="alGuardar"
    />
  </div>
</template>

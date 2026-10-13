<script setup>
import { computed, ref } from "vue";
import { seccionService, TURNOS, CAPACIDAD_MINIMA, CAPACIDAD_MAXIMA } from "@/services/seccionService";
import { erroresCampos, mensajeError } from "@/services/api";

const props = defineProps({
  // Sección a editar; sin ella el formulario registra una nueva
  seccion: { type: Object, default: null },
  // Años lectivos que no están cerrados
  anios: { type: Array, default: () => [] },
  grados: { type: Array, default: () => [] },
  // Docentes con cuenta activa
  docentes: { type: Array, default: () => [] },
  anioPorDefecto: { type: [Number, String], default: "" },
});

const emit = defineEmits(["cerrar", "guardado"]);

const editando = computed(() => !!props.seccion);
// Con estudiantes o materias asignadas no puede cambiar de grado ni de turno
const conDependencias = computed(
  () => editando.value && (props.seccion.total_matriculas > 0 || props.seccion.asignaciones_count > 0)
);

const formData = ref({
  nombre: props.seccion?.nombre ?? "",
  capacidad: props.seccion?.capacidad ?? "",
  turno: props.seccion?.turno ?? "",
  anio_lectivo_id: props.seccion?.anio_lectivo_id ?? props.anioPorDefecto ?? "",
  grado_id: props.seccion?.grado_id ?? "",
  profesor_id: props.seccion?.profesor_id ?? "",
});

// El docente actual sigue en la lista aunque su cuenta ya no esté activa
const opcionesDocente = computed(() => {
  const lista = [...props.docentes];
  if (props.seccion?.profesor && !lista.some((d) => d.id === props.seccion.profesor_id)) {
    lista.push({ ...props.seccion.profesor, inactivo: true });
  }
  return lista;
});

const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const guardarSeccion = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    const datos = { ...formData.value, nombre: formData.value.nombre.trim().toUpperCase() };
    const respuesta = editando.value
      ? await seccionService.actualizar(props.seccion.id, datos)
      : await seccionService.crear(datos);

    emit("guardado", respuesta.message);
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar la sección");
    }
  } finally {
    guardando.value = false;
  }
};

const claseCampo = (campo, bloqueado = false) => [
  "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
  errores.value[campo] ? "border-red-400" : "border-slate-300",
  bloqueado ? "bg-slate-100 text-slate-500" : "",
];
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ editando ? "Editar Sección" : "Nueva Sección" }}
        </h2>
        <span v-if="editando" class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
          {{ seccion.grado?.nombre }} {{ seccion.nombre }}
        </span>
      </div>

      <div class="p-6">
        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <form @submit.prevent="guardarSeccion" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Año lectivo</label>
              <select v-model="formData.anio_lectivo_id" required :class="claseCampo('anio_lectivo_id')">
                <option value="" disabled>Seleccione un año lectivo</option>
                <option v-for="anio in anios" :key="anio.id" :value="anio.id">
                  {{ anio.nombre }}{{ anio.estado === "activo" ? " (activo)" : "" }}
                </option>
              </select>
              <p v-if="errores.anio_lectivo_id" class="text-red-600 text-xs mt-1">{{ errores.anio_lectivo_id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Grado</label>
              <select v-model="formData.grado_id" required :disabled="conDependencias" :class="claseCampo('grado_id', conDependencias)">
                <option value="" disabled>Seleccione un grado</option>
                <option v-for="grado in grados" :key="grado.id" :value="grado.id">{{ grado.nombre }}</option>
              </select>
              <p v-if="errores.grado_id" class="text-red-600 text-xs mt-1">{{ errores.grado_id }}</p>
              <p v-else-if="!grados.length" class="text-amber-600 text-xs mt-1">Registre primero los grados en Catálogos &gt; Grados.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Sección</label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                maxlength="10"
                placeholder="Ej: A"
                :class="[claseCampo('nombre'), 'uppercase']"
              />
              <p v-if="errores.nombre" class="text-red-600 text-xs mt-1">{{ errores.nombre }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Turno</label>
              <select v-model="formData.turno" required :disabled="conDependencias" :class="claseCampo('turno', conDependencias)">
                <option value="" disabled>Seleccione un turno</option>
                <option v-for="turno in TURNOS" :key="turno.valor" :value="turno.valor">{{ turno.etiqueta }}</option>
              </select>
              <p v-if="errores.turno" class="text-red-600 text-xs mt-1">{{ errores.turno }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Capacidad</label>
              <input
                v-model.number="formData.capacidad"
                type="number"
                required
                :min="Math.max(CAPACIDAD_MINIMA, seccion?.matriculados ?? 0)"
                :max="CAPACIDAD_MAXIMA"
                placeholder="Ej: 30"
                :class="claseCampo('capacidad')"
              />
              <p v-if="errores.capacidad" class="text-red-600 text-xs mt-1">{{ errores.capacidad }}</p>
              <p v-else class="text-slate-500 text-xs mt-1">De {{ CAPACIDAD_MINIMA }} a {{ CAPACIDAD_MAXIMA }} estudiantes (límite provisional).</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Docente responsable</label>
            <select v-model="formData.profesor_id" required :class="claseCampo('profesor_id')">
              <option value="" disabled>Seleccione un docente</option>
              <option v-for="docente in opcionesDocente" :key="docente.id" :value="docente.id" :disabled="docente.inactivo">
                {{ docente.codigo }} · {{ docente.nombre }}{{ docente.inactivo ? " (cuenta no activa)" : "" }}
              </option>
            </select>
            <p v-if="errores.profesor_id" class="text-red-600 text-xs mt-1">{{ errores.profesor_id }}</p>
            <p v-else class="text-slate-500 text-xs mt-1">Un docente puede ser responsable de una sola sección por turno en el año.</p>
          </div>

          <p v-if="conDependencias" class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            La sección tiene estudiantes o materias asignadas: el grado y el turno no se pueden cambiar.
          </p>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="emit('cerrar')"
              class="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar sección" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

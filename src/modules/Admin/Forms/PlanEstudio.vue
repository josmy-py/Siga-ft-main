<script setup>
import { computed, ref, watch } from "vue";
import Swal from "sweetalert2";
import { planEstudioService } from "@/services/catalogoService";
import { erroresCampos, mensajeError } from "@/services/api";

const props = defineProps({
  // Plan a editar; sin él el formulario registra uno nuevo
  plan: { type: Object, default: null },
  especialidades: { type: Array, default: () => [] },
});

const emit = defineEmits(["guardado", "cancelar"]);

const vacio = () => ({
  nombre: "",
  especialidad_id: "",
  estado: true,
  fecha_aprobacion: "",
  fecha_inicio: "",
  fecha_fin: "",
  descripcion: "",
});

const Plan = ref(vacio());
const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const editando = computed(() => !!props.plan);

const limpiar = () => {
  Plan.value = props.plan
    ? {
        nombre: props.plan.nombre,
        especialidad_id: props.plan.especialidad_id ?? "",
        estado: !!props.plan.estado,
        fecha_aprobacion: props.plan.fecha_aprobacion ?? "",
        fecha_inicio: props.plan.fecha_inicio ?? "",
        fecha_fin: props.plan.fecha_fin ?? "",
        descripcion: props.plan.descripcion ?? "",
      }
    : vacio();
  errores.value = {};
  errorGeneral.value = null;
};

watch(() => props.plan, limpiar, { immediate: true });

const guardarPlan = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    const datos = {
      ...Plan.value,
      nombre: Plan.value.nombre.trim(),
      descripcion: Plan.value.descripcion.trim(),
      especialidad_id: Plan.value.especialidad_id || null,
    };
    const { message } = editando.value
      ? await planEstudioService.update(props.plan.id, datos)
      : await planEstudioService.create(datos);
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
    Plan.value = vacio();
    emit("guardado");
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar el plan de estudio");
    }
  } finally {
    guardando.value = false;
  }
};

const claseCampo = (campo, bloqueado = false) => [
  "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition",
  errores.value[campo] ? "border-red-400" : "border-gray-200",
  bloqueado ? "bg-slate-100 text-slate-500" : "bg-white",
];
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">

        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-book text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ editando ? "Editar Plan de Estudio" : "Nuevo Plan de Estudio" }}
          </h2>
          <p class="text-blue-100">
            {{ editando ? `Modificando: ${plan.nombre}` : "Sus materias se agregan después de guardarlo" }}
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarPlan" class="p-8 space-y-5">

        <div v-if="errorGeneral" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del plan</label>
            <input
              v-model="Plan.nombre"
              type="text"
              required
              maxlength="30"
              placeholder="Ej: Plan Básica 2026"
              :class="claseCampo('nombre')"
            />
            <p v-if="errores.nombre" class="text-red-600 text-xs mt-1">{{ errores.nombre }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Máximo 30 caracteres.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
            <select
              v-model="Plan.especialidad_id"
              :class="claseCampo('especialidad_id')"
            >
              <option value="">Sin especialidad</option>
              <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">{{ esp.nombre }}</option>
            </select>
            <p v-if="errores.especialidad_id" class="text-red-600 text-xs mt-1">{{ errores.especialidad_id }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Opcional (planes de bachillerato).</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de aprobación</label>
            <input v-model="Plan.fecha_aprobacion" type="date" required :class="claseCampo('fecha_aprobacion')" />
            <p v-if="errores.fecha_aprobacion" class="text-red-600 text-xs mt-1">{{ errores.fecha_aprobacion }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Inicio de vigencia</label>
            <input v-model="Plan.fecha_inicio" type="date" required :class="claseCampo('fecha_inicio')" />
            <p v-if="errores.fecha_inicio" class="text-red-600 text-xs mt-1">{{ errores.fecha_inicio }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fin de vigencia</label>
            <input v-model="Plan.fecha_fin" type="date" required :min="Plan.fecha_inicio || undefined" :class="claseCampo('fecha_fin')" />
            <p v-if="errores.fecha_fin" class="text-red-600 text-xs mt-1">{{ errores.fecha_fin }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            v-model="Plan.descripcion"
            required
            maxlength="200"
            rows="2"
            placeholder="Ej: Programa oficial del MINED para primer grado"
            :class="claseCampo('descripcion')"
          ></textarea>
          <p v-if="errores.descripcion" class="text-red-600 text-xs mt-1">{{ errores.descripcion }}</p>
          <p v-else class="text-xs text-gray-500 mt-1">{{ Plan.descripcion.length }} / 200 caracteres.</p>
        </div>

        <label class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer">
          <input v-model="Plan.estado" type="checkbox" class="mt-1 h-4 w-4" />
          <span>
            <span class="block text-sm font-medium text-gray-700">Plan vigente</span>
            <span class="block text-xs text-gray-500">
              Solo las materias de un plan vigente se pueden asignar a las secciones.
            </span>
          </span>
        </label>
        <p v-if="errores.estado" class="text-red-600 text-xs">{{ errores.estado }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button
            v-if="editando"
            type="button"
            @click="emit('cancelar')"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar edición
          </button>
          <button
            v-else
            type="button"
            @click="limpiar"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <i class="pi pi-refresh mr-2"></i>
            Limpiar
          </button>

          <button
            type="submit"
            :disabled="guardando"
            class="px-6 py-3 rounded-xl bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            <i class="pi pi-check"></i>
            {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar Plan" }}
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

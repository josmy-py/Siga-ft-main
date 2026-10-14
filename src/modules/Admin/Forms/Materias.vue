<script setup>
import { computed, ref, watch } from "vue";
import Swal from "sweetalert2";
import { asignaturaService } from "@/services/catalogoService";
import { erroresCampos, mensajeError } from "@/services/api";

// M2.5 (D-C1): las materias se administran dentro de su plan de estudios
const props = defineProps({
  plan: { type: Object, required: true },
  // Materia a renombrar; sin ella el formulario agrega una nueva al plan
  materia: { type: Object, default: null },
});

const emit = defineEmits(["guardado", "cancelar"]);

const editando = computed(() => !!props.materia);
const Materias = ref({
  nombre: ""
});
const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const limpiar = () => {
  Materias.value = {
    nombre: props.materia?.nombre ?? ""
  };
  errores.value = {};
  errorGeneral.value = null;
};

watch(() => [props.materia, props.plan.id], limpiar, { immediate: true });

const guardarMateria = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    // La materia siempre queda en el plan abierto (no se mueve entre planes)
    const datos = { nombre: Materias.value.nombre.trim(), plan_estudio_id: props.plan.id };
    const { message } = editando.value
      ? await asignaturaService.update(props.materia.id, datos)
      : await asignaturaService.create(datos);
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
    Materias.value = { nombre: "" };
    emit("guardado");
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar la materia");
    }
  } finally {
    guardando.value = false;
  }
};
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
            {{ editando ? "Renombrar Materia" : "Nueva Materia" }}
          </h2>
          <p class="text-blue-100">
            Plan: {{ plan.nombre }}{{ plan.especialidad ? ` · ${plan.especialidad.nombre}` : "" }}
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarMateria" class="p-8">

        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <div class="space-y-2">

          <label class="text-sm font-medium text-gray-700">
            Nombre de la materia
          </label>

          <div class="relative">

            <i class="pi pi-bookmark absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="Materias.nombre"
              type="text"
              required
              maxlength="50"
              placeholder="Ej: Matemática"
              :class="errores.nombre || errores.plan_estudio_id ? 'border-red-400' : 'border-gray-200'"
              class="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
            />

          </div>

          <p v-if="errores.nombre || errores.plan_estudio_id" class="text-red-600 text-xs">{{ errores.nombre || errores.plan_estudio_id }}</p>
          <p v-else class="text-xs text-gray-500">
            Ingresa el nombre de la materia que se impartirá en este plan (no se repite dentro del plan, máximo 50 caracteres).
          </p>

        </div>

        <div class="flex justify-end gap-3 mt-8">

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
            {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar Materia" }}
          </button>

        </div>

      </form>

    </div>
  </div>
</template>

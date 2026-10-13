<script setup>
import { computed, ref, watch } from "vue";
import Swal from "sweetalert2";
import { enfermedadService } from "@/services/catalogoService";
import { erroresCampos, mensajeError } from "@/services/api";

const props = defineProps({
  // Enfermedad a editar; sin ella el formulario registra una nueva
  enfermedad: { type: Object, default: null },
});

const emit = defineEmits(["guardado", "cancelar"]);

const editando = computed(() => !!props.enfermedad);
const Enfermedades = ref({ nombre: "", medicamento: "" });
const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const limpiar = () => {
  Enfermedades.value = { nombre: props.enfermedad?.nombre ?? "", medicamento: props.enfermedad?.medicamento ?? "" };
  errores.value = {};
  errorGeneral.value = null;
};

watch(() => props.enfermedad, limpiar, { immediate: true });

const guardarEnfermedad = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    const datos = { nombre: Enfermedades.value.nombre.trim(), medicamento: Enfermedades.value.medicamento.trim() };
    const { message } = editando.value
      ? await enfermedadService.update(props.enfermedad.id, datos)
      : await enfermedadService.create(datos);
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
    Enfermedades.value = { nombre: "", medicamento: "" };
    emit("guardado");
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar la enfermedad");
    }
  } finally {
    guardando.value = false;
  }
};
</script>
<template>
<div class="w-full p-4 md:p-6">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-1 px-5 flex items-center gap-2">

        <div class="flex items-center gap-4">

          <div
            class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"
          >
            <i class="pi pi-heart text-white text-2xl"></i>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-white">
              {{ editando ? "Editar Enfermedad" : "Nueva Enfermedad" }}
            </h2>

            <p class="text-blue-100">
              {{ editando ? `Modificando: ${enfermedad.nombre}` : "Registra una enfermedad y su medicamento para la ficha de salud" }}
            </p>
          </div>

        </div>

      </div>

      <form
        @submit.prevent="guardarEnfermedad"
        class="p-8"
      >

        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <div class="space-y-2">

          <label
            class="text-sm font-medium text-gray-700"
          >
            Nombre de la enfermedad
          </label>

          <div class="relative">

            <i
              class="pi pi-heart absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>

            <input
              v-model="Enfermedades.nombre"
              type="text"
              required
              maxlength="50"
              placeholder="Ej: Asma"
              class="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
              :class="errores.nombre ? 'border-red-400' : 'border-gray-200'"
            />

          </div>

          <p v-if="errores.nombre" class="text-red-600 text-xs">{{ errores.nombre }}</p>
          <p v-else class="text-xs text-gray-500">
            Máximo 50 caracteres.
          </p>

        </div>

        <div class="space-y-2 mt-6">

          <label class="text-sm font-medium text-gray-700">
            Medicamento
          </label>

          <div class="relative">

            <i class="pi pi-plus-circle absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="Enfermedades.medicamento"
              type="text"
              required
              maxlength="50"
              placeholder="Ej: Salbutamol"
              class="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
              :class="errores.medicamento ? 'border-red-400' : 'border-gray-200'"
            />

          </div>

          <p v-if="errores.medicamento" class="text-red-600 text-xs">{{ errores.medicamento }}</p>
          <p v-else class="text-xs text-gray-500">
            Medicamento habitual para esa enfermedad (obligatorio, máximo 50 caracteres).
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
            class="px-6 py-3 rounded-xl bg-blue-600 text-white border border-transparent hover:bg-blue-700 shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            <i class="pi pi-check"></i>
            {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar Enfermedad" }}
          </button>

        </div>

      </form>

    </div>

  </div>
</template>

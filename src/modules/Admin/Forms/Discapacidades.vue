<script setup>
import { computed, ref, watch } from "vue";
import Swal from "sweetalert2";
import { discapacidadService } from "@/services/catalogoService";
import { erroresCampos, mensajeError } from "@/services/api";

const props = defineProps({
  // Discapacidad a editar; sin ella el formulario registra una nueva
  discapacidad: { type: Object, default: null },
});

const emit = defineEmits(["guardado", "cancelar"]);

const editando = computed(() => !!props.discapacidad);
const Discapacidades = ref({ nombre: "" });
const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const limpiar = () => {
  Discapacidades.value = { nombre: props.discapacidad?.nombre ?? "" };
  errores.value = {};
  errorGeneral.value = null;
};

watch(() => props.discapacidad, limpiar, { immediate: true });

const guardarDiscapacidad = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    const datos = { nombre: Discapacidades.value.nombre.trim() };
    const { message } = editando.value
      ? await discapacidadService.update(props.discapacidad.id, datos)
      : await discapacidadService.create(datos);
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
    Discapacidades.value = { nombre: "" };
    emit("guardado");
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar la discapacidad");
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
            <i class="pi pi-shield text-white text-2xl"></i>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-white">
              {{ editando ? "Editar Discapacidad" : "Nueva Discapacidad" }}
            </h2>

            <p class="text-blue-100">
              {{ editando ? `Modificando: ${discapacidad.nombre}` : "Registra una discapacidad para el expediente de matrícula" }}
            </p>
          </div>

        </div>

      </div>

      <form
        @submit.prevent="guardarDiscapacidad"
        class="p-8"
      >

        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <div class="space-y-2">

          <label
            class="text-sm font-medium text-gray-700"
          >
            Nombre de la discapacidad
          </label>

          <div class="relative">

            <i
              class="pi pi-book absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>

            <input
              v-model="Discapacidades.nombre"
              type="text"
              required
              maxlength="50"
              placeholder="Ej: Discapacidad visual"
              class="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition"
              :class="errores.nombre ? 'border-red-400' : 'border-gray-200'"
            />

          </div>

          <p v-if="errores.nombre" class="text-red-600 text-xs">{{ errores.nombre }}</p>
          <p v-else class="text-xs text-gray-500">
            Nombre con el que se registrará en la ficha de salud del estudiante (máximo 50 caracteres).
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
            {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar Discapacidad" }}
          </button>

        </div>

      </form>

    </div>

  </div>
</template>

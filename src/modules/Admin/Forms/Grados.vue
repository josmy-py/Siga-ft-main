<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import { gradoService } from "@/services/catalogoService";
import { erroresCampos, mensajeError } from "@/services/api";

const props = defineProps({
  // Grado a editar; sin él el formulario registra uno nuevo
  grado: { type: Object, default: null },
});

const emit = defineEmits(["guardado", "cancelar"]);

// El diagrama solo tiene "nombre" y se escribe como texto. La API lo compara con
// el catálogo oficial (sin importar mayúsculas ni tildes), porque cada grado
// tiene su orden fijo para la promoción, y no admite grados repetidos.
const Grados = ref({
  nombre: ""
});

const editando = computed(() => !!props.grado);
const catalogo = ref([]);
const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const registrados = computed(() => catalogo.value.filter((g) => g.grado_id !== null).length);

const cargarCatalogo = async () => {
  try {
    catalogo.value = await gradoService.catalogo();
  } catch (error) {
    catalogo.value = [];
    errorGeneral.value = mensajeError(error, "No se pudo cargar el catálogo oficial de grados");
  }
};

onMounted(cargarCatalogo);
defineExpose({ cargarCatalogo });

const limpiar = () => {
  Grados.value = {
    nombre: props.grado?.nombre ?? ""
  };
  errores.value = {};
  errorGeneral.value = null;
};

watch(() => props.grado, limpiar, { immediate: true });

const guardarGrado = async () => {
  errores.value = {};
  errorGeneral.value = null;
  guardando.value = true;
  try {
    const { message } = editando.value
      ? await gradoService.update(props.grado.id, { ...Grados.value })
      : await gradoService.create({ ...Grados.value });
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
    Grados.value = { nombre: "" };
    await cargarCatalogo();
    emit("guardado");
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar el grado");
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
          <i class="pi pi-graduation-cap text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ editando ? "Editar Grado" : "Nuevo Grado" }}
          </h2>
          <p class="text-blue-100">
            {{ editando ? `Modificando: ${grado.nombre}` : `${registrados} de ${catalogo.length} grados oficiales registrados` }}
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarGrado" class="p-8">

        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <div class="space-y-2">

          <label class="text-sm font-medium text-gray-700">
            Nombre del grado
          </label>

          <div class="relative">

            <i class="pi pi-book absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model.trim="Grados.nombre"
              type="text"
              maxlength="50"
              required
              placeholder="Ej.: Primer grado"
              :class="errores.nombre ? 'border-red-400' : 'border-gray-200'"
              class="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none transition bg-white"
            />

          </div>

          <p v-if="errores.nombre" class="text-red-600 text-xs">{{ errores.nombre }}</p>
          <p v-else-if="editando" class="text-xs text-amber-600">
            El nombre define el orden de promoción: solo se puede cambiar si el grado aún no tiene secciones ni planes de estudio.
          </p>
          <p v-else class="text-xs text-gray-500">
            Escriba el nombre oficial del grado (por ejemplo «Parvularia 4 años», «Primer grado» o «Primer año de bachillerato»). No se admiten grados repetidos.
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
            {{ guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar Grado" }}
          </button>

        </div>

      </form>

    </div>
  </div>
</template>

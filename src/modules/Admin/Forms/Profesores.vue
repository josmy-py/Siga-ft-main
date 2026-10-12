<script setup>
import { computed, ref } from "vue";
import { profesorService } from "@/services/profesorService";
import { erroresCampos, mensajeError } from "@/services/api";
import { duiValido, normalizarDui } from "@/utils/dui";

const props = defineProps({
  // Docente a editar; sin él el formulario registra uno nuevo
  profesor: { type: Object, default: null },
});

const emit = defineEmits(["cerrar", "guardado"]);

const editando = computed(() => !!props.profesor);
const hoy = new Date().toISOString().slice(0, 10);

const formData = ref({
  nombre: props.profesor?.nombre ?? "",
  dui: props.profesor?.dui ?? "",
  email: props.profesor?.user?.email ?? "",
  fecha_nacimiento: props.profesor?.fecha_nacimiento ?? "",
  telefono: props.profesor?.telefono ?? "",
  direccion: props.profesor?.direccion ?? "",
  especialidad: props.profesor?.especialidad ?? "",
  fecha_contratacion: props.profesor?.fecha_contratacion ?? "",
});

const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const guardarProfesor = async () => {
  errores.value = {};
  errorGeneral.value = null;

  if (!editando.value && !duiValido(formData.value.dui)) {
    errores.value = { dui: "El DUI no es válido. Use el formato 00000000-0." };
    return;
  }

  guardando.value = true;
  try {
    const { dui, email, ...datos } = formData.value;
    const respuesta = editando.value
      ? await profesorService.actualizar(props.profesor.id, datos)
      : await profesorService.crear({ ...datos, email, dui: normalizarDui(dui) });

    emit("guardado", respuesta.message);
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar el profesor");
    }
  } finally {
    guardando.value = false;
  }
};

const cerrar = () => {
  emit("cerrar");
};

const claseCampo = (campo, bloqueado = false) => [
  "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
  errores.value[campo] ? "border-red-400" : "border-slate-300",
  bloqueado ? "bg-slate-100 text-slate-500" : "",
];
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ editando ? "Editar Profesor" : "Registrar Profesor" }}
        </h2>
        <span v-if="editando" class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
          {{ profesor.codigo }}
        </span>
      </div>

      <div class="p-6">
        <div v-if="errorGeneral" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorGeneral }}
        </div>

        <form @submit.prevent="guardarProfesor" class="space-y-5">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nombre completo</label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                maxlength="50"
                placeholder="Nombre del profesor"
                :class="claseCampo('nombre')"
              />
              <p v-if="errores.nombre" class="text-red-600 text-xs mt-1">{{ errores.nombre }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">DUI</label>
              <input
                v-model="formData.dui"
                type="text"
                :required="!editando"
                :disabled="editando"
                placeholder="00000000-0"
                :class="claseCampo('dui', editando)"
              />
              <p v-if="errores.dui" class="text-red-600 text-xs mt-1">{{ errores.dui }}</p>
              <p v-else-if="editando" class="text-slate-500 text-xs mt-1">El DUI no puede modificarse.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Correo electrónico (cuenta del docente)</label>
              <input
                v-model="formData.email"
                type="email"
                :required="!editando"
                :disabled="editando"
                placeholder="correo@ejemplo.com"
                :class="claseCampo('email', editando)"
              />
              <p v-if="errores.email" class="text-red-600 text-xs mt-1">{{ errores.email }}</p>
              <p v-else-if="editando" class="text-slate-500 text-xs mt-1">El correo se cambia en la gestión de usuarios.</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Teléfono</label>
              <input
                v-model="formData.telefono"
                type="tel"
                required
                maxlength="9"
                placeholder="0000-0000"
                :class="claseCampo('telefono')"
              />
              <p v-if="errores.telefono" class="text-red-600 text-xs mt-1">{{ errores.telefono }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Fecha de nacimiento</label>
              <input
                v-model="formData.fecha_nacimiento"
                type="date"
                required
                :max="hoy"
                :class="claseCampo('fecha_nacimiento')"
              />
              <p v-if="errores.fecha_nacimiento" class="text-red-600 text-xs mt-1">{{ errores.fecha_nacimiento }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Especialidad</label>
              <input
                v-model="formData.especialidad"
                type="text"
                required
                maxlength="50"
                placeholder="Ej. Matemática"
                :class="claseCampo('especialidad')"
              />
              <p v-if="errores.especialidad" class="text-red-600 text-xs mt-1">{{ errores.especialidad }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Fecha de contratación</label>
              <input
                v-model="formData.fecha_contratacion"
                type="date"
                required
                :max="hoy"
                :class="claseCampo('fecha_contratacion')"
              />
              <p v-if="errores.fecha_contratacion" class="text-red-600 text-xs mt-1">{{ errores.fecha_contratacion }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Dirección</label>
            <textarea
              v-model="formData.direccion"
              rows="3"
              required
              maxlength="100"
              placeholder="Ingrese la dirección del profesor"
              :class="claseCampo('direccion')"
            ></textarea>
            <p v-if="errores.direccion" class="text-red-600 text-xs mt-1">{{ errores.direccion }}</p>
          </div>

          <p v-if="!editando" class="text-sm text-slate-500">
            El código (PROF-001, PROF-002...) se asigna automáticamente. Se creará la cuenta del docente
            y recibirá un enlace en su correo para definir su contraseña.
          </p>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="cerrar"
              class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="guardando"
              class="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ guardando ? "Guardando..." : editando ? "Guardar Cambios" : "Guardar Profesor" }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usuarioService } from "@/services/usuarioService";
import { erroresCampos, mensajeError } from "@/services/api";
import { ROL_OPCIONES } from "@/constants/roles";
import { duiValido, normalizarDui } from "@/utils/dui";

const props = defineProps({
  // Cuenta a editar; sin ella el formulario crea una nueva
  usuario: { type: Object, default: null },
});

const emit = defineEmits(["cerrar", "guardado"]);

const editando = computed(() => !!props.usuario);
// Cuenta heredada sin DUI: el director puede completarlo una sola vez
const completarDui = computed(() => editando.value && !props.usuario?.dui);
const duiBloqueado = computed(() => editando.value && !completarDui.value);

const formData = ref({
  nombre: props.usuario?.nombre ?? "",
  email: props.usuario?.email ?? "",
  dui: props.usuario?.dui ?? "",
  rol: props.usuario?.rol ?? "",
});

const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const guardarForm = async () => {
  errores.value = {};
  errorGeneral.value = null;

  const validarDui = !editando.value || (completarDui.value && formData.value.dui);
  if (validarDui && !duiValido(formData.value.dui)) {
    errores.value = { dui: "El DUI no es válido. Use el formato 00000000-0." };
    return;
  }

  guardando.value = true;
  try {
    const { nombre, email, rol, dui } = formData.value;
    const respuesta = editando.value
      ? await usuarioService.actualizar(props.usuario.id, {
          nombre, email, rol, ...(completarDui.value && dui ? { dui: normalizarDui(dui) } : {}),
        })
      : await usuarioService.crear({ nombre, email, rol, dui: normalizarDui(dui) });

    emit("guardado", respuesta.message);
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar el usuario");
    }
  } finally {
    guardando.value = false;
  }
};

const cerrar = () => {
  emit("cerrar");
};

const claseCampo = (campo) => [
  "w-full h-11 px-4 border rounded-lg focus:outline-none",
  errores.value[campo] ? "border-red-400" : "border-slate-300 focus:border-gray-500",
];
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <form
      @submit.prevent="guardarForm"
      class="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900">
          {{ editando ? "Editar Usuario" : "Registrar Usuario" }}
        </h2>
      </div>

      <div v-if="errorGeneral" class="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ errorGeneral }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Nombre Completo
          </label>

          <input
            v-model="formData.nombre"
            type="text"
            required
            maxlength="80"
            :class="claseCampo('nombre')"
            placeholder="Ingrese el nombre"
          />
          <p v-if="errores.nombre" class="text-red-600 text-xs mt-1">{{ errores.nombre }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Correo Electrónico
          </label>

          <input
            v-model="formData.email"
            type="email"
            required
            :class="claseCampo('email')"
            placeholder="correo@ejemplo.com"
          />
          <p v-if="errores.email" class="text-red-600 text-xs mt-1">{{ errores.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            DUI
          </label>

          <input
            v-model="formData.dui"
            type="text"
            :required="!editando"
            :disabled="duiBloqueado"
            :class="[claseCampo('dui'), duiBloqueado ? 'bg-slate-100 text-slate-500' : '']"
            placeholder="00000000-0"
          />
          <p v-if="errores.dui" class="text-red-600 text-xs mt-1">{{ errores.dui }}</p>
          <p v-else-if="completarDui" class="text-slate-500 text-xs mt-1">Esta cuenta no tiene DUI. Ingréselo solo si lo verificó con un documento; después no podrá modificarse.</p>
          <p v-else-if="editando" class="text-slate-500 text-xs mt-1">El DUI no puede modificarse.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Rol
          </label>

          <select
            v-model="formData.rol"
            required
            :class="claseCampo('rol')"
          >
            <option value="">Seleccione un rol</option>
            <option v-for="opcion in ROL_OPCIONES" :key="opcion.valor" :value="opcion.valor">
              {{ opcion.etiqueta }}
            </option>
          </select>
          <p v-if="errores.rol" class="text-red-600 text-xs mt-1">{{ errores.rol }}</p>
        </div>

      </div>

      <p v-if="!editando" class="mt-6 text-sm text-slate-500">
        La cuenta se crea pendiente. La persona recibirá un enlace en su correo para definir su contraseña;
        al hacerlo, la cuenta quedará activa.
      </p>

      <div class="flex justify-end gap-4 mt-8 pt-6 border-t">
        <button
          type="button"
          @click="cerrar"
          class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="guardando"
          class="px-6 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ guardando ? "Guardando..." : editando ? "Guardar Cambios" : "Registrar Usuario" }}
        </button>
      </div>
    </form>
  </div>
</template>

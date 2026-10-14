<script setup>
import { computed, ref } from "vue";
import { usuarioService } from "@/services/usuarioService";
import { erroresCampos, mensajeError } from "@/services/api";
import { ROL_OPCIONES } from "@/constants/roles";

const props = defineProps({
  // Cuenta a editar; sin ella el formulario crea una nueva
  usuario: { type: Object, default: null },
});

const emit = defineEmits(["cerrar", "guardado"]);

const editando = computed(() => !!props.usuario);

// Campos del diagrama: email, password y rol
const formData = ref({
  email: props.usuario?.email ?? "",
  password: "",
  rol: props.usuario?.rol ?? "",
});

const errores = ref({});
const errorGeneral = ref(null);
const guardando = ref(false);

const guardarForm = async () => {
  errores.value = {};
  errorGeneral.value = null;

  const { email, password, rol } = formData.value;
  if (!editando.value && (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password))) {
    errores.value = { password: "La contraseña debe tener al menos 8 caracteres, con letras y números." };
    return;
  }

  guardando.value = true;
  try {
    const respuesta = editando.value
      ? await usuarioService.actualizar(props.usuario.id, { email, rol })
      : await usuarioService.crear({ email, password, rol });

    emit("guardado", respuesta.message);
  } catch (error) {
    errores.value = erroresCampos(error);
    if (!Object.keys(errores.value).length) {
      errorGeneral.value = mensajeError(error, "No se pudo guardar el usuario");
    }
  } finally {
    formData.value.password = "";
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

        <div v-if="!editando">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Contraseña
          </label>

          <input
            v-model="formData.password"
            type="password"
            required
            autocomplete="new-password"
            :class="claseCampo('password')"
            placeholder="Mínimo 8 caracteres, letras y números"
          />
          <p v-if="errores.password" class="text-red-600 text-xs mt-1">{{ errores.password }}</p>
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
        Comparta la contraseña con la persona; podrá cambiarla desde su sesión.
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

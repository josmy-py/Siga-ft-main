<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { erroresCampos, mensajeError } from "../../services/api";
import { familiaService } from "../../services/familiaService";
import { PATRON_NOMBRE, soloLetras } from "./nombres";

// M5 (D3): los padres y madres se registran primero, sin estudiante. La relación
// (parientes) se crea al guardar al estudiante, donde se les busca por su DUI;
// así cada familia solo ve a sus propios registros.
const padres = ref([]);
const cargando = ref(true);
const error = ref("");
const cuentaConResponsable = ref(false);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const [familia, perfil] = await Promise.all([familiaService.padres(), familiaService.perfil()]);
    padres.value = familia;
    // Un solo responsable por cuenta: con perfil de encargado (o ya registrado como padre) no se ofrece
    cuentaConResponsable.value = !!(perfil.encargado || perfil.padre);
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar los padres.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const exito = (titulo, texto) => Swal.fire({ icon: "success", title: titulo, text: texto });
const primerError = (e, porDefecto) => Object.values(erroresCampos(e))[0] ?? mensajeError(e, porDefecto);

// --- Registro (modal «Nuevo Registro») ---
const mostrarModal = ref(false);
const aviso = ref("");
const errores = ref({});
const guardando = ref(false);
const vacio = () => ({ parentesco: "Padre", nombre: "", dui: "", telefono: "", correo: "", responsable: false });
const nuevoPadre = ref(vacio());

const abrirRegistro = () => {
  nuevoPadre.value = vacio();
  aviso.value = "";
  errores.value = {};
  mostrarModal.value = true;
};

const guardarPadre = async () => {
  errores.value = {};
  aviso.value = "";
  guardando.value = true;
  try {
    await familiaService.registrarPadre({
      nombre: nuevoPadre.value.nombre,
      dui: nuevoPadre.value.dui,
      telefono: nuevoPadre.value.telefono || null,
      email: nuevoPadre.value.correo || null,
      es_responsable: nuevoPadre.value.responsable,
    });
    mostrarModal.value = false;
    Swal.fire({ icon: "success", title: "Registro exitoso", timer: 2000, showConfirmButton: false });
    await cargar();
  } catch (e) {
    errores.value = erroresCampos(e);
    if (!Object.keys(errores.value).length) aviso.value = mensajeError(e, "No se pudo guardar");
  } finally {
    guardando.value = false;
  }
};

// --- Edición (D-E5) ---
const editado = ref(null);
const datosEdicion = ref({});
const editar = (padre) => {
  editado.value = padre;
  datosEdicion.value = { nombre: padre.nombre, dui: padre.dui, telefono: padre.telefono ?? "", email: padre.email ?? "" };
  errores.value = {};
};
const guardarEdicion = async () => {
  errores.value = {};
  guardando.value = true;
  try {
    const { message } = await familiaService.actualizarPadre(editado.value.id, {
      ...datosEdicion.value,
      telefono: datosEdicion.value.telefono || null,
      email: datosEdicion.value.email || null,
    });
    editado.value = null;
    exito(message);
    await cargar();
  } catch (e) {
    errores.value = erroresCampos(e);
    if (!Object.keys(errores.value).length) Swal.fire({ icon: "warning", title: mensajeError(e, "No se pudo actualizar") });
  } finally {
    guardando.value = false;
  }
};

// --- Desvincular (D-E7) ---
const quitar = async (padre, est) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Quitar el vínculo?",
    text: `${padre.nombre} dejará de figurar como ${est.pivot.parentesco.toLowerCase()} de ${est.nombre}. Sus datos se conservan.`,
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await familiaService.desvincular(est.id, padre.id);
    Swal.fire({ icon: "success", title: message, timer: 2200, showConfirmButton: false });
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "warning", title: primerError(e, "No se pudo quitar el vínculo") });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1 animate-fade-in">
        <!-- Encabezado de la sección -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Registro de Padres</h2>
            <p class="text-sm text-gray-500 mt-1">
              Registre primero al padre y/o a la madre; después, al registrar al estudiante, búsquelos por su DUI.
            </p>
          </div>
          <button
            @click="abrirRegistro"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
          >
            <i class="pi pi-user-plus"></i>
            Registrar
          </button>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>

        <!-- Lista de Padres Registrados -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
          <div v-if="cargando" class="p-8 text-center text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>Cargando...
          </div>
          <div v-else-if="padres.length === 0" class="p-8 text-center text-gray-500">
            Aún no hay padres relacionados con sus estudiantes.
          </div>

          <div
            v-for="padre in cargando ? [] : padres"
            :key="padre.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border-b border-gray-50 last:border-0 gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                  padre.estudiantes.length ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400',
                ]"
              >
                <i class="pi pi-user text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800">
                  {{ padre.nombre }}
                  <span v-if="padre.user_id" class="ml-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Responsable</span>
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  DUI: {{ padre.dui }}
                  <template v-if="padre.telefono"> • Tel. {{ padre.telefono }}</template>
                </p>
                <p v-if="!padre.estudiantes.length" class="text-xs text-gray-400 mt-0.5">Sin estudiantes relacionados</p>
                <p v-for="e in padre.estudiantes" :key="e.id" class="text-xs text-gray-500 mt-0.5">
                  {{ e.pivot.parentesco }} de {{ e.nombre }}
                  <button @click="quitar(padre, e)" class="ml-2 text-red-600 hover:underline">Quitar</button>
                </p>
              </div>
            </div>

            <div class="flex gap-2 sm:w-auto w-full">
              <button
                @click="editar(padre)"
                :disabled="!padre.editable"
                :title="padre.editable ? 'Editar' : 'Esta persona también pertenece a otra familia o tiene su propia cuenta: solo la dirección modifica sus datos'"
                class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm flex-1 disabled:opacity-50"
              >
                <i class="pi pi-pencil text-xs"></i> Editar
              </button>
            </div>
          </div>
        </div>

        <!-- Modal de Registro -->
        <div
          v-if="mostrarModal"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        >
          <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-xl font-bold text-gray-800">Nuevo Registro</h2>
              <button @click="mostrarModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>

            <form @submit.prevent="guardarPadre" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                <select
                  v-model="nuevoPadre.parentesco"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-600"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  :value="nuevoPadre.nombre"
                  @input="nuevoPadre.nombre = soloLetras($event.target.value); $event.target.value = nuevoPadre.nombre"
                  type="text"
                  required
                  maxlength="80"
                  :pattern="PATRON_NOMBRE"
                  title="Solo letras y espacios"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                <input
                  v-model="nuevoPadre.dui"
                  type="text"
                  required
                  placeholder="00000000-0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p v-if="errores.dui" class="text-xs text-red-600 mt-1">{{ errores.dui }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    v-model="nuevoPadre.telefono"
                    type="text"
                    maxlength="15"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input
                    v-model="nuevoPadre.correo"
                    type="email"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p v-if="errores.email" class="text-xs text-red-600 mt-1">{{ errores.email }}</p>
                </div>
              </div>
              <div>
                <p class="block text-sm font-medium text-gray-700 mb-1">¿Será el responsable del estudiante?</p>
                <div class="flex gap-6 text-sm">
                  <label class="flex items-center gap-2"><input type="radio" :value="true" v-model="nuevoPadre.responsable" :disabled="cuentaConResponsable" /> Sí</label>
                  <label class="flex items-center gap-2"><input type="radio" :value="false" v-model="nuevoPadre.responsable" /> No</label>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ cuentaConResponsable
                    ? "Su cuenta ya tiene un responsable registrado."
                    : "El responsable es la persona titular de esta cuenta." }}
                </p>
                <p v-if="errores.es_responsable" class="text-xs text-red-600 mt-1">{{ errores.es_responsable }}</p>
              </div>

              <div v-if="aviso" class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <i class="pi pi-info-circle mr-1"></i>{{ aviso }}
              </div>

              <div class="flex justify-end gap-3 pt-4 mt-2 border-t">
                <button
                  type="button"
                  @click="mostrarModal = false"
                  class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardando"
                  class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-60"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal de Edición -->
        <div
          v-if="editado"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        >
          <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-xl font-bold text-gray-800">Editar datos</h2>
              <button @click="editado = null" class="text-gray-400 hover:text-gray-600">
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>
            <form @submit.prevent="guardarEdicion" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input :value="datosEdicion.nombre" @input="datosEdicion.nombre = soloLetras($event.target.value); $event.target.value = datosEdicion.nombre" type="text" required maxlength="80" :pattern="PATRON_NOMBRE" class="w-full px-4 py-2 border rounded-lg" />
                <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                <input v-model="datosEdicion.dui" type="text" required :disabled="!!editado.user_id" class="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                <p v-if="editado.user_id" class="text-xs text-gray-500 mt-1">Es el DUI de una cuenta: no se cambia aquí.</p>
                <p v-if="errores.dui" class="text-xs text-red-600 mt-1">{{ errores.dui }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input v-model="datosEdicion.telefono" type="text" maxlength="15" class="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input v-model="datosEdicion.email" type="email" class="w-full px-4 py-2 border rounded-lg" />
                  <p v-if="errores.email" class="text-xs text-red-600 mt-1">{{ errores.email }}</p>
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-4 mt-2 border-t">
                <button type="button" @click="editado = null" class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition">Cancelar</button>
                <button type="submit" :disabled="guardando" class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-60">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

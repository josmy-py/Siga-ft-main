<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { erroresCampos, mensajeError } from "../../services/api";
import { estudianteService } from "../../services/estudianteService";
import { familiaService } from "../../services/familiaService";

// M5 (D3): padres y madres de la familia de la cuenta. Una persona por DUI: si ya
// está en la familia se vincula; si pertenece a otra familia, la dirección autoriza.
const route = useRoute();

const estudiantes = ref([]);
const estudianteId = ref(route.query.estudiante ? Number(route.query.estudiante) : null);
const padres = ref([]);
const cargando = ref(true);
const error = ref("");

const estudiante = computed(() => estudiantes.value.find((e) => e.id === estudianteId.value));
const vinculoCon = (padre) => padre.estudiantes.find((e) => e.id === estudianteId.value);
const ordenados = computed(() =>
  [...padres.value].sort((a, b) => Number(!!vinculoCon(b)) - Number(!!vinculoCon(a)) || a.nombre.localeCompare(b.nombre))
);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const [lista, familia] = await Promise.all([estudianteService.listar(), familiaService.padres()]);
    estudiantes.value = lista;
    padres.value = familia;
    if (!estudiantes.value.some((e) => e.id === estudianteId.value)) estudianteId.value = estudiantes.value[0]?.id ?? null;
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar los padres.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const exito = (titulo) => Swal.fire({ icon: "success", title: titulo, timer: 2200, showConfirmButton: false });
const primerError = (e, porDefecto) => Object.values(erroresCampos(e))[0] ?? mensajeError(e, porDefecto);

// --- Registro / vínculo ---
const mostrarModal = ref(false);
const paso = ref("dui"); // dui -> encontrado | nuevo
const encontrado = ref(null);
const aviso = ref("");
const errores = ref({});
const guardando = ref(false);
const vacio = () => ({ nombre: "", relacion: "Padre", dui: "", telefono: "", correo: "", esCuenta: false });
const nuevoPadre = ref(vacio());

const abrirRegistro = () => {
  nuevoPadre.value = vacio();
  const ocupados = new Set(padres.value.map(vinculoCon).filter(Boolean).map((v) => v.pivot.parentesco));
  if (ocupados.has("Padre") && !ocupados.has("Madre")) nuevoPadre.value.relacion = "Madre";
  paso.value = "dui";
  encontrado.value = null;
  aviso.value = "";
  errores.value = {};
  mostrarModal.value = true;
};

const buscarDui = async () => {
  errores.value = {};
  aviso.value = "";
  if (!nuevoPadre.value.dui.trim()) {
    errores.value = { dui: "Ingrese el DUI." };
    return;
  }
  try {
    encontrado.value = await familiaService.buscarPadre(nuevoPadre.value.dui);
    paso.value = encontrado.value ? "encontrado" : "nuevo";
  } catch (e) {
    aviso.value = mensajeError(e, "No se pudo buscar el DUI");
  }
};

const guardarPadre = async () => {
  errores.value = {};
  aviso.value = "";
  guardando.value = true;
  try {
    if (paso.value === "encontrado") {
      await familiaService.vincular(estudianteId.value, nuevoPadre.value.dui, nuevoPadre.value.relacion);
      exito(`${encontrado.value.nombre} quedó vinculado(a) como ${nuevoPadre.value.relacion.toLowerCase()}`);
    } else {
      const { message } = await familiaService.registrarPadre({
        nombre: nuevoPadre.value.nombre,
        dui: nuevoPadre.value.dui,
        telefono: nuevoPadre.value.telefono || null,
        email: nuevoPadre.value.correo || null,
        es_encargado: nuevoPadre.value.esCuenta,
        estudiante_id: estudianteId.value,
        parentesco: nuevoPadre.value.relacion,
      });
      exito(message);
    }
    mostrarModal.value = false;
    await cargar();
  } catch (e) {
    errores.value = erroresCampos(e);
    const autorizacion = (errores.value.dui ?? e.response?.data?.message ?? "").includes("dirección");
    if (autorizacion) {
      aviso.value = errores.value.dui ?? e.response.data.message;
      errores.value = {};
    } else if (!Object.keys(errores.value).length) {
      aviso.value = mensajeError(e, "No se pudo guardar");
    }
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
const quitar = async (padre) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Quitar el vínculo?",
    text: `${padre.nombre} dejará de figurar como ${vinculoCon(padre).pivot.parentesco.toLowerCase()} de ${estudiante.value.nombre}. Sus datos se conservan.`,
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await familiaService.desvincular(estudianteId.value, padre.id);
    exito(message);
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "warning", title: primerError(e, "No se pudo quitar el vínculo") });
  }
};

watch(estudianteId, () => (mostrarModal.value = false));
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-gray-800">Padres / Encargados</h1>
          </div>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="p-6 lg:p-8 flex-1 animate-fade-in">
        <!-- Encabezado de la sección -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Registro de Padres</h2>
            <p class="text-sm text-gray-500 mt-1">
              Administre la información de los padres de familia
            </p>
          </div>
          <button
            @click="abrirRegistro"
            :disabled="!estudianteId"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
          >
            <i class="pi pi-user-plus"></i>
            Registrar
          </button>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>

        <div v-if="!cargando && !estudiantes.length" class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Primero registre a sus estudiantes en
          <router-link :to="{ name: 'registro-cliente' }" class="underline font-medium">Registro</router-link>.
        </div>

        <div v-else class="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <label class="text-sm font-medium text-gray-700">Estudiante</label>
          <select v-model="estudianteId" class="px-4 py-2 border rounded-lg bg-white min-w-72">
            <option v-for="e in estudiantes" :key="e.id" :value="e.id">{{ e.nombre }}</option>
          </select>
        </div>

        <!-- Lista de Padres Registrados -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
          <div v-if="cargando" class="p-8 text-center text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>Cargando...
          </div>
          <div v-else-if="padres.length === 0" class="p-8 text-center text-gray-500">
            No hay padres registrados aún.
          </div>

          <div
            v-for="padre in cargando ? [] : ordenados"
            :key="padre.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border-b border-gray-50 last:border-0 gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                  vinculoCon(padre) ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400',
                ]"
              >
                <i class="pi pi-user text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800">
                  {{ padre.nombre }}
                  <span v-if="padre.user_id" class="ml-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Titular de una cuenta</span>
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  <template v-if="vinculoCon(padre)">{{ vinculoCon(padre).pivot.parentesco }} • </template>DUI: {{ padre.dui }}
                  <template v-if="padre.telefono"> • Tel. {{ padre.telefono }}</template>
                </p>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ padre.estudiantes.map((e) => `${e.pivot.parentesco} de ${e.nombre}`).join(" · ") || "Sin estudiantes vinculados" }}
                </p>
              </div>
            </div>

            <div class="flex gap-2 sm:w-auto w-full">
              <button
                v-if="vinculoCon(padre)"
                @click="quitar(padre)"
                class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2 shadow-sm flex-1"
              >
                <i class="pi pi-times text-xs"></i> Quitar
              </button>
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
            <p class="text-sm text-gray-500 -mt-3 mb-4">Para {{ estudiante?.nombre }}</p>

            <form @submit.prevent="paso === 'dui' ? buscarDui() : guardarPadre()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                <select
                  v-model="nuevoPadre.relacion"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                </select>
                <p v-if="errores.parentesco" class="text-xs text-red-600 mt-1">{{ errores.parentesco }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                <div class="flex gap-2">
                  <input
                    v-model="nuevoPadre.dui"
                    type="text"
                    required
                    :disabled="paso !== 'dui'"
                    placeholder="00000000-0"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                  />
                  <button v-if="paso !== 'dui'" type="button" @click="paso = 'dui'; aviso = ''" class="px-3 text-sm text-blue-600 hover:underline">Cambiar</button>
                </div>
                <p v-if="errores.dui" class="text-xs text-red-600 mt-1">{{ errores.dui }}</p>
              </div>

              <div v-if="paso === 'encontrado'" class="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
                <i class="pi pi-check-circle mr-1"></i>
                {{ encontrado.nombre }} ya está registrado(a) en su familia. Se vinculará como {{ nuevoPadre.relacion.toLowerCase() }}.
              </div>

              <template v-if="paso === 'nuevo'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    v-model="nuevoPadre.nombre"
                    type="text"
                    required
                    maxlength="80"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
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
                <label class="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" v-model="nuevoPadre.esCuenta" class="w-4 h-4" />
                  Soy yo: esta persona es la titular de esta cuenta
                </label>
              </template>

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
                  {{ paso === "dui" ? "Buscar" : paso === "encontrado" ? "Vincular" : "Guardar" }}
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
                <input v-model="datosEdicion.nombre" type="text" required maxlength="80" class="w-full px-4 py-2 border rounded-lg" />
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

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { familiaService, PARENTESCOS_ENCARGADO } from "../../services/familiaService";
import { estudianteService } from "../../services/estudianteService";
import { erroresCampos, mensajeError } from "../../services/api";

// M5: perfil familiar de la cuenta en sesión (API real). La cuenta puede ser
// padre/madre (tabla padres) o un encargado que no es padre ni madre (tabla encargados).
const router = useRouter();

const cuenta = ref(null);
const padre = ref(null);
const encargado = ref(null);
const hijos = ref([]);
const cargando = ref(true);
const error = ref("");

// Formulario (padre o encargado)
const modal = ref(null); // 'padre' | 'encargado'
const form = ref({});
const errores = ref({});
const guardando = ref(false);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const [perfil, lista] = await Promise.all([familiaService.perfil(), estudianteService.listar()]);
    cuenta.value = perfil.cuenta;
    padre.value = perfil.padre;
    encargado.value = perfil.encargado;
    hijos.value = lista;
  } catch (e) {
    error.value = mensajeError(e, "No se pudo cargar su perfil.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const editarPadre = () => {
  form.value = {
    nombre: padre.value.nombre,
    dui: padre.value.dui,
    telefono: padre.value.telefono ?? "",
    email: padre.value.email ?? "",
  };
  errores.value = {};
  modal.value = "padre";
};

const abrirEncargado = () => {
  form.value = encargado.value
    ? { ...encargado.value }
    : { nombre: "", dui: "", parentesco: "", telefono: "", direccion: "" };
  errores.value = {};
  modal.value = "encargado";
};

const cerrar = () => {
  modal.value = null;
};

const guardar = async () => {
  guardando.value = true;
  errores.value = {};
  try {
    let respuesta;
    if (modal.value === "padre") {
      respuesta = await familiaService.actualizarPadre(padre.value.id, form.value);
    } else {
      const datos = {
        nombre: form.value.nombre,
        dui: form.value.dui,
        parentesco: form.value.parentesco,
        telefono: form.value.telefono,
        direccion: form.value.direccion,
      };
      respuesta = encargado.value
        ? await familiaService.actualizarEncargado(encargado.value.id, datos)
        : await familiaService.registrarEncargado(datos);
    }
    modal.value = null;
    Swal.fire({ icon: "success", title: respuesta.message, timer: 2000, showConfirmButton: false });
    await cargar();
  } catch (e) {
    errores.value = erroresCampos(e);
    if (!Object.keys(errores.value).length) {
      Swal.fire({ icon: "error", title: mensajeError(e, "No se pudieron guardar los datos") });
    }
  } finally {
    guardando.value = false;
  }
};

const irPadres = () => router.push({ name: "registro-padres" });
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">

      <div class="bg-gray-100 p-6 rounded-2xl">
        <div v-if="cargando" class="p-10 text-center text-gray-500">
          <i class="pi pi-spin pi-spinner mr-2"></i>Cargando perfil...
        </div>

        <div v-else-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ error }} <button class="underline ml-2" @click="cargar">Reintentar</button>
        </div>

        <template v-else>
          <!-- CARD PERFIL -->
          <div class="bg-white rounded-2xl shadow p-6 mb-6">
            <div class="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <i class="pi pi-user text-blue-600"></i>
                  {{ cuenta?.email }}
                </h1>
                <p class="text-gray-500 text-sm mt-1">Cuenta de encargado</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              <!-- PADRE O MADRE -->
              <div class="bg-white rounded-2xl shadow p-6">
                <div class="flex justify-between items-start mb-4">
                  <h2 class="text-lg font-semibold text-gray-700">
                    <i class="pi pi-id-card mr-2 text-blue-500"></i>
                    Datos como padre o madre
                  </h2>
                  <button
                    v-if="padre"
                    @click="editarPadre"
                    class="bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>
                </div>

                <div v-if="padre" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-user text-gray-500"></i>
                    <span><b>Nombre:</b> {{ padre.nombre }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-credit-card text-gray-500"></i>
                    <span><b>DUI:</b> {{ padre.dui }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-phone text-gray-500"></i>
                    <span><b>Teléfono:</b> {{ padre.telefono || "—" }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-envelope text-gray-500"></i>
                    <span><b>Correo:</b> {{ padre.email || "—" }}</span>
                  </div>
                </div>
                <div v-else-if="encargado" class="text-sm text-gray-500">
                  Su cuenta tiene perfil de encargado: ese perfil es el responsable de sus estudiantes.
                </div>
                <div v-else class="text-sm text-gray-500">
                  No está registrado como padre o madre. Si lo es, regístrese en
                  <button class="text-blue-600 underline" @click="irPadres">Padres</button>
                  marcando «Soy yo».
                </div>
              </div>

              <!-- ENCARGADO (no padre ni madre) -->
              <div class="bg-white rounded-2xl shadow p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h2 class="text-lg font-semibold text-gray-700">
                      <i class="pi pi-shield mr-2 text-purple-500"></i>
                      Datos como encargado
                    </h2>
                    <p class="text-xs text-gray-500 mt-1">
                      Solo si usted es responsable del estudiante sin ser su padre o madre (tío, abuelo, hermano o primo).
                    </p>
                  </div>
                  <button
                    v-if="!padre || encargado"
                    @click="abrirEncargado"
                    class="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    <i :class="encargado ? 'pi pi-pencil' : 'pi pi-plus'"></i>
                    {{ encargado ? "Editar" : "Registrar" }}
                  </button>
                </div>

                <div v-if="encargado" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <span><b>Nombre:</b> {{ encargado.nombre }}</span>
                  <span><b>DUI:</b> {{ encargado.dui }}</span>
                  <span><b>Parentesco:</b> {{ encargado.parentesco }}</span>
                  <span><b>Teléfono:</b> {{ encargado.telefono }}</span>
                  <span class="md:col-span-2"><b>Dirección:</b> {{ encargado.direccion }}</span>
                </div>
                <div v-else-if="padre" class="text-sm text-gray-500">
                  Usted está registrado como padre o madre: es el responsable de sus estudiantes y no se registra un encargado adicional.
                </div>
                <div v-else class="text-sm text-gray-500">
                  Sin datos de encargado registrados. Si no es el padre ni la madre del estudiante, regístrelos: son obligatorios para matricular.
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow p-6">
              <h2 class="text-lg font-semibold mb-4 text-gray-700">
                <i class="pi pi-users mr-2 text-purple-500"></i>
                Alumnos registrados
              </h2>

              <div class="space-y-4">
                <div v-for="hijo in hijos" :key="hijo.id" class="border rounded-xl p-4 bg-gray-50">
                  <p class="font-semibold text-gray-800">
                    <i class="pi pi-user mr-2"></i>
                    {{ hijo.nombre }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    <i class="pi pi-book mr-2"></i>
                    <template v-if="hijo.ultima_matricula?.seccion">
                      {{ hijo.ultima_matricula.seccion.grado?.nombre }} - Sección {{ hijo.ultima_matricula.seccion.nombre }}
                      ({{ hijo.ultima_matricula.anio_lectivo?.anio }}, matrícula {{ hijo.ultima_matricula.estado }})
                    </template>
                    <template v-else>Sin matrícula</template>
                  </p>
                </div>
                <p v-if="!hijos.length" class="text-sm text-gray-500">No hay estudiantes registrados.</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- MODAL EDICIÓN -->
    <div v-if="modal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form @submit.prevent="guardar" class="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 class="text-lg font-bold text-gray-800">
          {{ modal === "padre" ? "Editar mis datos de padre o madre" : encargado ? "Editar mis datos de encargado" : "Registrar mis datos de encargado" }}
        </h2>

        <div>
          <label class="text-sm text-gray-600">Nombre</label>
          <input v-model="form.nombre" class="w-full border p-2 rounded-lg" />
          <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-600">DUI</label>
          <input v-model="form.dui" class="w-full border p-2 rounded-lg" placeholder="00000000-0" />
          <p v-if="errores.dui" class="text-xs text-red-600 mt-1">{{ errores.dui }}</p>
        </div>
        <div v-if="modal === 'encargado'">
          <label class="text-sm text-gray-600">Parentesco con el estudiante</label>
          <select v-model="form.parentesco" class="w-full border p-2 rounded-lg">
            <option value="" disabled>Seleccione</option>
            <option v-for="p in PARENTESCOS_ENCARGADO" :key="p" :value="p">{{ p }}</option>
          </select>
          <p v-if="errores.parentesco" class="text-xs text-red-600 mt-1">{{ errores.parentesco }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-600">Teléfono</label>
          <input v-model="form.telefono" placeholder="7777-7777" class="w-full border p-2 rounded-lg" />
          <p v-if="errores.telefono" class="text-xs text-red-600 mt-1">{{ errores.telefono }}</p>
        </div>
        <div v-if="modal === 'padre'">
          <label class="text-sm text-gray-600">Correo</label>
          <input v-model="form.email" type="email" class="w-full border p-2 rounded-lg" />
          <p v-if="errores.email" class="text-xs text-red-600 mt-1">{{ errores.email }}</p>
        </div>
        <div v-else>
          <label class="text-sm text-gray-600">Dirección</label>
          <input v-model="form.direccion" class="w-full border p-2 rounded-lg" />
          <p v-if="errores.direccion" class="text-xs text-red-600 mt-1">{{ errores.direccion }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            type="submit"
            :disabled="guardando"
            class="bg-blue-600 border border-blue-600 text-white py-2 rounded-xl flex justify-center gap-2 disabled:opacity-60"
          >
            <i class="pi pi-save"></i> Guardar
          </button>
          <button type="button" @click="cerrar" class="bg-gray-100 border border-gray-400 text-gray-600 py-2 rounded-xl">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

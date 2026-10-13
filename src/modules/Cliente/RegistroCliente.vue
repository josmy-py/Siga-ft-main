<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import api, { erroresCampos, mensajeError } from "../../services/api";
import { estudianteService } from "../../services/estudianteService";
import { familiaService } from "../../services/familiaService";

// M5: registro y edición del estudiante con la API real. Los padres se eligen de
// la familia de la cuenta; para agregar uno nuevo se usa la pantalla "Padres".
const props = defineProps({
  estudianteId: { type: Number, default: null },
  // Dirección: edita solo los datos del estudiante; la familia se gestiona en la ficha
  sinPadres: { type: Boolean, default: false },
});
const emit = defineEmits(["cerrar", "guardado"]);

const estudiante = ref({
  nombre: "",
  nie: "",
  fecha_nacimiento: "",
  genero: "",
  distrito_id: null,
  canton: "",
  direccion: "",
});
const permisos = ref({ editar_nie: true });
const vinculados = ref([]);
const errores = ref({});
const cargando = ref(true);
const guardando = ref(false);

// --- Distrito: buscador sobre el catálogo real (M2.1) ---
const todosLosDistritos = ref([]);
const busquedaDistrito = ref("");
const mostrarDropdownDistrito = ref(false);
const distritoSeleccionado = computed(() => todosLosDistritos.value.find((d) => d.id === estudiante.value.distrito_id));

const distritosFiltrados = computed(() => {
  const busqueda = busquedaDistrito.value.toLowerCase();
  const lista = !busqueda
    ? todosLosDistritos.value
    : todosLosDistritos.value.filter(
        (d) => d.nombre.toLowerCase().includes(busqueda) || d.municipio?.nombre.toLowerCase().includes(busqueda)
      );
  return lista.slice(0, 50);
});

const seleccionarDistrito = (distrito) => {
  estudiante.value.distrito_id = distrito.id;
  busquedaDistrito.value = distrito.nombre;
  mostrarDropdownDistrito.value = false;
};

const verificarInputDistrito = () => {
  if (busquedaDistrito.value === "") estudiante.value.distrito_id = null;
};

const ocultarDropdown = () => setTimeout(() => (mostrarDropdownDistrito.value = false), 200);

// --- Padres de la familia ---
const padresFamilia = ref([]);
const padreDesconocido = ref(false);
const madreDesconocida = ref(false);
const padreId = ref(null);
const madreId = ref(null);

const cargar = async () => {
  cargando.value = true;
  try {
    const [{ data }, padres] = await Promise.all([api.get("/distritos"), props.sinPadres ? [] : familiaService.padres()]);
    todosLosDistritos.value = data.distritos;
    padresFamilia.value = padres;

    if (props.estudianteId) {
      const ficha = await estudianteService.obtener(props.estudianteId);
      const e = ficha.estudiante;
      estudiante.value = {
        nombre: e.nombre,
        nie: e.nie ?? "",
        fecha_nacimiento: e.fecha_nacimiento?.slice(0, 10) ?? "",
        genero: e.genero,
        distrito_id: e.distrito_id,
        canton: e.canton ?? "",
        direccion: e.direccion,
      };
      busquedaDistrito.value = e.distrito?.nombre ?? "";
      permisos.value = ficha.permisos;
      vinculados.value = e.padres;
    }
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudieron cargar los datos del formulario") });
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const guardarEstudiante = async () => {
  errores.value = {};
  guardando.value = true;
  const datos = { ...estudiante.value, nie: estudiante.value.nie.trim() || null, canton: estudiante.value.canton || null };
  try {
    if (props.estudianteId) {
      const { message } = await estudianteService.actualizar(props.estudianteId, datos);
      emit("guardado", message);
      return;
    }

    const { message, estudiante: creado } = await estudianteService.crear(datos);
    const pendientes = [];
    for (const [id, parentesco, omitir] of [[padreId.value, "Padre", padreDesconocido.value], [madreId.value, "Madre", madreDesconocida.value]]) {
      if (!id || omitir) continue;
      try {
        await familiaService.vincularPorId(creado.id, id, parentesco);
      } catch (e) {
        pendientes.push(`${parentesco}: ${Object.values(erroresCampos(e))[0] ?? mensajeError(e, "no se pudo vincular")}`);
      }
    }
    if (pendientes.length) {
      await Swal.fire({ icon: "warning", title: "Estudiante registrado", text: `Revise en "Padres": ${pendientes.join(" ")}` });
    }
    emit("guardado", message);
  } catch (e) {
    errores.value = erroresCampos(e);
    if (!Object.keys(errores.value).length) {
      Swal.fire({ icon: e.response?.status === 409 ? "warning" : "error", title: mensajeError(e, "No se pudo guardar el estudiante") });
    }
  } finally {
    guardando.value = false;
  }
};

const cancelar = () => emit("cerrar");
</script>

<template>
  <div class="w-full">
    <p v-if="cargando" class="text-center text-gray-500 py-6">
      <i class="pi pi-spin pi-spinner mr-2"></i>Cargando...
    </p>
    <form v-else @submit.prevent="guardarEstudiante" class="space-y-6">

      <!-- Nombre completo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          v-model="estudiante.nombre"
          type="text"
          maxlength="80"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ingrese el nombre completo"
        />
        <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
      </div>

      <!-- NIE y fecha de nacimiento -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            NIE <span class="text-gray-400 font-normal">(opcional si aún no lo tiene)</span>
          </label>
          <input
            v-model="estudiante.nie"
            type="text"
            inputmode="numeric"
            maxlength="10"
            :disabled="!permisos.editar_nie"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Solo números"
          />
          <p v-if="!permisos.editar_nie" class="text-xs text-gray-500 mt-1">
            Con la matrícula aprobada, solo la dirección puede cambiar el NIE.
          </p>
          <p v-if="errores.nie" class="text-xs text-red-600 mt-1">{{ errores.nie }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento
          </label>
          <input
            v-model="estudiante.fecha_nacimiento"
            type="date"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p v-if="errores.fecha_nacimiento" class="text-xs text-red-600 mt-1">{{ errores.fecha_nacimiento }}</p>
        </div>
      </div>

      <!-- Género -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Género
        </label>
        <div class="flex gap-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="Masculino" v-model="estudiante.genero" />
            Masculino
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="Femenino" v-model="estudiante.genero" />
            Femenino
          </label>
        </div>
        <p v-if="errores.genero" class="text-xs text-red-600 mt-1">{{ errores.genero }}</p>
      </div>

      <!-- Lugar de nacimiento (Distrito primero) -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Lugar de nacimiento
        </h3>
        <div class="grid md:grid-cols-3 gap-4">

          <!-- 1. Distrito (Buscador) -->
          <div class="relative">
            <label class="block text-sm text-gray-600 mb-1">
              Distrito
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="busquedaDistrito"
                @focus="mostrarDropdownDistrito = true"
                @blur="ocultarDropdown"
                @input="verificarInputDistrito"
                placeholder="Buscar distrito..."
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              />
              <i class="pi pi-search absolute right-3 top-3 text-gray-400"></i>
            </div>

            <ul
              v-if="mostrarDropdownDistrito"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
            >
              <li
                v-for="distrito in distritosFiltrados"
                :key="distrito.id"
                @mousedown.prevent="seleccionarDistrito(distrito)"
                class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition"
              >
                {{ distrito.nombre }} <span class="text-gray-400">· {{ distrito.municipio?.nombre }}</span>
              </li>

              <li v-if="distritosFiltrados.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                No se encontraron resultados
              </li>
            </ul>
            <p v-if="errores.distrito_id" class="text-xs text-red-600 mt-1">{{ errores.distrito_id }}</p>
          </div>

          <!-- 2. Municipio (autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Municipio
            </label>
            <input
              :value="distritoSeleccionado?.municipio?.nombre ?? ''"
              disabled
              placeholder="Seleccione un distrito"
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          <!-- 3. Departamento (autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Departamento
            </label>
            <input
              :value="distritoSeleccionado?.municipio?.departamento?.nombre ?? ''"
              disabled
              placeholder="Seleccione un distrito"
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

        </div>
      </div>

      <!-- Cantón -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Cantón
        </label>
        <textarea
          v-model="estudiante.canton"
          rows="2"
          maxlength="50"
          class="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Escriba el cantón o caserío correspondiente..."
        />
      </div>

      <!-- Dirección -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Dirección
        </label>
        <textarea
          v-model="estudiante.direccion"
          rows="3"
          maxlength="100"
          class="w-full px-4 py-2 border rounded-lg resize-none"
          placeholder="Ingrese la dirección completa"
        />
        <p v-if="errores.direccion" class="text-xs text-red-600 mt-1">{{ errores.direccion }}</p>
      </div>

      <!-- Información de los padres -->
      <div v-if="!sinPadres" class="border-t pt-6 mt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex justify-between items-center">
          Información de los padres
          <router-link :to="{ name: 'registro-padres' }" class="text-xs text-blue-600 hover:underline font-normal">
            Registrar padres en "Padres"
          </router-link>
        </h3>

        <!-- Edición: padres ya vinculados -->
        <div v-if="estudianteId" class="border rounded-xl p-5 bg-gray-50/50 text-sm">
          <p v-if="!vinculados.length" class="text-gray-500">Aún no tiene padres vinculados.</p>
          <p v-for="p in vinculados" :key="p.id" class="text-gray-700">
            <span class="font-semibold">{{ p.pivot.parentesco }}:</span> {{ p.nombre }} ({{ p.dui }})
          </p>
          <router-link
            :to="{ name: 'registro-padres', query: { estudiante: estudianteId } }"
            class="inline-block mt-3 text-blue-600 hover:underline"
          >
            Gestionar padres de este estudiante
          </router-link>
        </div>

        <template v-else>
          <!-- Padre -->
          <div class="border rounded-xl p-5 mb-4 bg-gray-50/50">
            <div class="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="padreDesconocido"
                v-model="padreDesconocido"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label for="padreDesconocido" class="text-sm font-bold text-gray-700 cursor-pointer">
                Padre desconocido o se registrará después
              </label>
            </div>

            <div v-if="!padreDesconocido" class="animate-fade-in">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Padre
              </label>
              <select
                v-model="padreId"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
              >
                <option :value="null">Seleccione un padre de la lista...</option>
                <option v-for="p in padresFamilia" :key="p.id" :value="p.id">{{ p.nombre }} ({{ p.dui }})</option>
              </select>
            </div>
          </div>

          <!-- Madre -->
          <div class="border rounded-xl p-5 bg-gray-50/50">
            <div class="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="madreDesconocida"
                v-model="madreDesconocida"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label for="madreDesconocida" class="text-sm font-bold text-gray-700 cursor-pointer">
                Madre desconocida o se registrará después
              </label>
            </div>

            <div v-if="!madreDesconocida" class="animate-fade-in">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Madre
              </label>
              <select
                v-model="madreId"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
              >
                <option :value="null">Seleccione una madre de la lista...</option>
                <option v-for="p in padresFamilia" :key="p.id" :value="p.id">{{ p.nombre }} ({{ p.dui }})</option>
              </select>
            </div>
          </div>
        </template>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="cancelar"
          class="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="guardando"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {{ guardando ? "Guardando..." : "Guardar estudiante" }}
        </button>
      </div>
    </form>
  </div>
</template>

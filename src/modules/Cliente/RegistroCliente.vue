<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api, { erroresCampos, mensajeError } from "../../services/api";
import { estudianteService } from "../../services/estudianteService";
import { familiaService } from "../../services/familiaService";
import { PATRON_NOMBRE, soloLetras } from "./nombres";

// M5: registro y edición del estudiante con la API real. Los padres se registran
// primero en «Registro de Padres»; aquí se indican por su DUI y la relación
// (parientes) se crea al guardar al estudiante. El NIE va en la matrícula.
const props = defineProps({
  estudianteId: { type: Number, default: null },
  // Dirección: edita solo los datos del estudiante; la familia se gestiona en la ficha
  sinPadres: { type: Boolean, default: false },
});
const emit = defineEmits(["cerrar", "guardado"]);

const router = useRouter();
const estudiante = ref({
  nombre: "",
  fecha_nacimiento: "",
  genero: "",
  distrito_id: null,
  canton: "",
  direccion: "",
});
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

// --- Padre y madre: se buscan por DUI entre los ya registrados ---
const nuevoVinculo = (parentesco) => ({ parentesco, dui: "", desconocido: false, encontrado: null, error: "", buscando: false });
const vinculosNuevos = ref([nuevoVinculo("Padre"), nuevoVinculo("Madre")]);

const buscarPadre = async (v) => {
  v.encontrado = null;
  v.error = "";
  if (!v.dui.trim()) {
    v.error = "Ingrese el DUI.";
    return;
  }
  v.buscando = true;
  try {
    v.encontrado = await familiaService.buscarPadre(v.dui);
    if (!v.encontrado) v.error = "No hay un padre o una madre registrados con ese DUI. Regístrelo primero en «Registro de Padres».";
  } catch (e) {
    v.error = mensajeError(e, "No se pudo buscar el DUI");
  } finally {
    v.buscando = false;
  }
};

// Edición: agregar padre o madre a un estudiante ya registrado
const agregado = ref(nuevoVinculo("Padre"));
const agregarPadre = async () => {
  agregado.value.error = "";
  try {
    const { message } = await familiaService.vincular(props.estudianteId, agregado.value.dui, agregado.value.parentesco);
    agregado.value = nuevoVinculo("Padre");
    Swal.fire({ icon: "success", title: message ?? "Vínculo registrado", timer: 2000, showConfirmButton: false });
    await cargar();
  } catch (e) {
    agregado.value.error = Object.values(erroresCampos(e))[0] ?? mensajeError(e, "No se pudo vincular");
  }
};

const quitarPadre = async (p) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Quitar el vínculo?",
    text: `${p.nombre} dejará de figurar como ${p.pivot.parentesco.toLowerCase()} del estudiante. Sus datos se conservan.`,
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    await familiaService.desvincular(props.estudianteId, p.id);
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "warning", title: Object.values(erroresCampos(e))[0] ?? mensajeError(e, "No se pudo quitar el vínculo") });
  }
};

const cargar = async () => {
  cargando.value = true;
  try {
    const { data } = await api.get("/distritos");
    todosLosDistritos.value = data.distritos;

    if (props.estudianteId) {
      const ficha = await estudianteService.obtener(props.estudianteId);
      const e = ficha.estudiante;
      estudiante.value = {
        nombre: e.nombre,
        // El NIE se pide en la matrícula; aquí solo lo corrige la dirección
        ...(props.sinPadres ? { nie: e.nie ?? "" } : {}),
        fecha_nacimiento: e.fecha_nacimiento?.slice(0, 10) ?? "",
        genero: e.genero,
        distrito_id: e.distrito_id,
        canton: e.canton ?? "",
        direccion: e.direccion,
      };
      busquedaDistrito.value = e.distrito?.nombre ?? "";
      vinculados.value = e.padres;
    }
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudieron cargar los datos del formulario") });
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

// Sin padres registrados y seleccionados no se guarda al estudiante (salvo la dirección)
const padresElegidos = () => {
  const activos = vinculosNuevos.value.filter((v) => !v.desconocido);
  const sinBuscar = activos.filter((v) => !v.encontrado);
  if (!activos.length || sinBuscar.length) {
    Swal.fire({
      icon: "warning",
      title: "Faltan los padres",
      text: !activos.length
        ? "Indique al padre o a la madre del estudiante."
        : `Busque por DUI al ${sinBuscar.map((v) => v.parentesco.toLowerCase()).join(" y a la ")} o marque que es desconocido(a). Si aún no está registrado(a), regístrelo(a) primero en «Registro de Padres».`,
      showCancelButton: true,
      confirmButtonText: "Ir a Registro de Padres",
      cancelButtonText: "Seguir aquí",
    }).then(({ isConfirmed }) => isConfirmed && router.push({ name: "registro-padres" }));
    return null;
  }
  return activos.map((v) => ({ dui: v.dui, parentesco: v.parentesco }));
};

const guardarEstudiante = async () => {
  errores.value = {};
  const datos = { ...estudiante.value, canton: estudiante.value.canton || null };
  if ("nie" in datos) datos.nie = datos.nie.trim() || null;
  if (!props.estudianteId && !props.sinPadres) {
    const padres = padresElegidos();
    if (!padres) return;
    datos.padres = padres;
  }
  guardando.value = true;
  try {
    if (props.estudianteId) {
      const { message } = await estudianteService.actualizar(props.estudianteId, datos);
      emit("guardado", message);
      return;
    }

    const { message } = await estudianteService.crear(datos);
    emit("guardado", message);
  } catch (e) {
    errores.value = erroresCampos(e);
    // Error en un DUI de la lista «padres»: se muestra junto a ese padre o madre
    vinculosNuevos.value.filter((v) => !v.desconocido).forEach((v, i) => {
      const error = errores.value[`padres.${i}.dui`] ?? errores.value[`padres.${i}.parentesco`];
      if (error) v.error = error;
    });
    if (errores.value.padres) Swal.fire({ icon: "warning", title: errores.value.padres });
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
          :value="estudiante.nombre"
          @input="estudiante.nombre = soloLetras($event.target.value); $event.target.value = estudiante.nombre"
          type="text"
          maxlength="80"
          :pattern="PATRON_NOMBRE"
          title="Solo letras y espacios"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ingrese el nombre completo"
        />
        <p class="text-xs text-gray-400 mt-1">Solo letras (con tildes y ñ) y espacios.</p>
        <p v-if="errores.nombre" class="text-xs text-red-600 mt-1">{{ errores.nombre }}</p>
      </div>

      <!-- Fecha de nacimiento (el NIE se pide en la matrícula; solo la dirección lo corrige aquí) -->
      <div class="grid md:grid-cols-2 gap-4">
        <div v-if="'nie' in estudiante">
          <label class="block text-sm font-medium text-gray-700 mb-1">NIE</label>
          <input
            v-model="estudiante.nie"
            type="text"
            inputmode="numeric"
            maxlength="10"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Solo números"
          />
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
        <h3 class="text-sm font-semibold text-gray-700 mb-1 flex justify-between items-center">
          Información de los padres
          <router-link :to="{ name: 'registro-padres' }" class="text-xs text-blue-600 hover:underline font-normal">
            Ir a «Registro de Padres»
          </router-link>
        </h3>

        <!-- Edición: padres ya vinculados -->
        <div v-if="estudianteId" class="border rounded-xl p-5 bg-gray-50/50 text-sm space-y-2">
          <p v-if="!vinculados.length" class="text-gray-500">Aún no tiene padres vinculados.</p>
          <div v-for="p in vinculados" :key="p.id" class="flex justify-between items-center gap-3">
            <p class="text-gray-700"><span class="font-semibold">{{ p.pivot.parentesco }}:</span> {{ p.nombre }} ({{ p.dui }})</p>
            <button type="button" @click="quitarPadre(p)" class="text-xs text-red-600 hover:underline">Quitar</button>
          </div>
          <div class="pt-3 border-t">
            <p class="text-gray-600 mb-2">Agregar un padre o una madre ya registrados:</p>
            <div class="flex flex-col sm:flex-row gap-2">
              <select v-model="agregado.parentesco" class="px-3 py-2 border rounded-lg bg-white">
                <option value="Padre">Padre</option>
                <option value="Madre">Madre</option>
              </select>
              <input v-model="agregado.dui" type="text" placeholder="DUI 00000000-0" class="flex-1 px-3 py-2 border rounded-lg" />
              <button type="button" @click="agregarPadre" :disabled="!agregado.dui.trim()" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Vincular</button>
            </div>
            <p v-if="agregado.error" class="text-xs text-red-600 mt-1">{{ agregado.error }}</p>
          </div>
        </div>

        <template v-else>
          <p class="text-xs text-gray-500 mb-4">
            Primero registre al padre y/o a la madre en «Registro de Padres». Aquí escriba su DUI y pulse Buscar;
            al guardar al estudiante se crea la relación.
          </p>
          <div v-for="v in vinculosNuevos" :key="v.parentesco" class="border rounded-xl p-5 mb-4 bg-gray-50/50">
            <div class="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                :id="`desconocido-${v.parentesco}`"
                v-model="v.desconocido"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label :for="`desconocido-${v.parentesco}`" class="text-sm font-bold text-gray-700 cursor-pointer">
                {{ v.parentesco === "Padre" ? "Padre desconocido o se registrará después" : "Madre desconocida o se registrará después" }}
              </label>
            </div>

            <div v-if="!v.desconocido" class="animate-fade-in">
              <label class="block text-sm font-medium text-gray-700 mb-2">DUI {{ v.parentesco === "Padre" ? "del padre" : "de la madre" }}</label>
              <div class="flex gap-2">
                <input
                  v-model="v.dui"
                  @input="v.encontrado = null; v.error = ''"
                  @keydown.enter.prevent="buscarPadre(v)"
                  type="text"
                  placeholder="00000000-0"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                />
                <button type="button" @click="buscarPadre(v)" :disabled="v.buscando" class="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50">
                  {{ v.buscando ? "Buscando..." : "Buscar" }}
                </button>
              </div>
              <p v-if="v.encontrado" class="text-sm text-emerald-700 mt-2">
                <i class="pi pi-check-circle mr-1"></i>{{ v.encontrado.nombre }}
              </p>
              <p v-if="v.error" class="text-xs text-red-600 mt-2">
                {{ v.error }}
                <router-link v-if="!v.encontrado" :to="{ name: 'registro-padres' }" class="underline ml-1">Registrar</router-link>
              </p>
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

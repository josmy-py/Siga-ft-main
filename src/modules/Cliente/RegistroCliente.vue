<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["cerrar", "save"]);

const listaDepartamentos = ref([
  { id: 1, nombre: "Chalatenango" },
  { id: 2, nombre: "San Salvador" }
]);

const listaMunicipios = ref({
  1: [
    { id: 101, nombre: "Chalatenango Sur" },
    { id: 102, nombre: "Chalatenango Norte" },
    { id: 103, nombre: "Chalatenango Centro" }
  ],
  2: [
    { id: 201, nombre: "San Salvador Centro" },
    { id: 202, nombre: "San Salvador Oeste" }
  ]
});

const listaDistritos = ref({
  102: [
    { id: 1001, nombre: "Citalá" },
    { id: 1002, nombre: "La Palma" },
    { id: 1003, nombre: "San Ignacio" }
  ],
  101: [
    { id: 1004, nombre: "Arcatao" },
    { id: 1005, nombre: "San José Las Flores" }
  ]
});

const estudiante = ref({
  nombres: "",
  nie: "",
  departamento_id: null,
  municipio_id: null,
  distrito_id: null,
  canton: "",
  telefono: "",
  correo: "",
  direccion: "",
  genero: ""
});

const todosLosDistritos = computed(() => {
  const distritosPlanos = [];
  for (const idMunicipio in listaDistritos.value) {
    listaDistritos.value[idMunicipio].forEach(distrito => {
      distritosPlanos.push({
        ...distrito,
        municipioPadreId: parseInt(idMunicipio)
      });
    });
  }
  return distritosPlanos.sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const alCambiarDistrito = () => {
  const idDistritoSeleccionado = estudiante.value.distrito_id;
  
  if (!idDistritoSeleccionado) {
    estudiante.value.municipio_id = null;
    estudiante.value.departamento_id = null;
    return;
  }

  const distritoEncontrado = todosLosDistritos.value.find(d => d.id === idDistritoSeleccionado);
  
  if (distritoEncontrado) {
    estudiante.value.municipio_id = distritoEncontrado.municipioPadreId;

    for (const idDepto in listaMunicipios.value) {
      const perteneceAlDepto = listaMunicipios.value[idDepto].some(
        m => m.id === distritoEncontrado.municipioPadreId
      );
      
      if (perteneceAlDepto) {
        estudiante.value.departamento_id = parseInt(idDepto);
        break;
      }
    }
  }
};

// --- NUEVAS VARIABLES Y FUNCIONES PARA EL BUSCADOR DE DISTRITOS ---
const busquedaDistrito = ref("");
const mostrarDropdownDistrito = ref(false);

const distritosFiltrados = computed(() => {
  if (!busquedaDistrito.value) return todosLosDistritos.value;
  const busqueda = busquedaDistrito.value.toLowerCase();
  return todosLosDistritos.value.filter(d => 
    d.nombre.toLowerCase().includes(busqueda)
  );
});

const seleccionarDistrito = (distrito) => {
  estudiante.value.distrito_id = distrito.id;
  busquedaDistrito.value = distrito.nombre; // Ponemos el nombre en el input
  mostrarDropdownDistrito.value = false; // Ocultamos la lista
  alCambiarDistrito(); // Llenamos Municipio y Depto automáticamente
};

const verificarInputDistrito = () => {
  if (busquedaDistrito.value === "") {
    estudiante.value.distrito_id = null;
    alCambiarDistrito();
  }
};
// -----------------------------------------------------------------

const padreDesconocido = ref(false);
const madreDesconocida = ref(false);

const padre = ref({
  nombre: "",
  telefono: "",
  dui: "",
  correo: ""
});

const madre = ref({
  nombre: "",
  telefono: "",
  dui: "",
  correo: ""
});

const guardarEstudiante = () => {
  if (
    !estudiante.value.nombres ||
    !estudiante.value.nie ||
    !estudiante.value.genero ||
    !estudiante.value.distrito_id
  ) {
    alert("Complete todos los campos obligatorios del estudiante.");
    return;
  }

  // Payload estructurado en snake_case para Laravel
  const payload = {
    ...estudiante.value,
    padre: padreDesconocido.value ? null : { ...padre.value },
    madre: madreDesconocida.value ? null : { ...madre.value },
    padre_desconocido: padreDesconocido.value,
    madre_desconocida: madreDesconocida.value
  };

  emit("save", payload);
};

const cancelar = () => {
  emit("cerrar");
};
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="guardarEstudiante" class="space-y-6">

      <!-- Nombre completo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          v-model="estudiante.nombres"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ingrese el nombre completo"
        />
      </div>

      <!-- Género -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Género
        </label>
        <div class="flex gap-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="M"
              v-model="estudiante.genero"
            />
            Masculino
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="F"
              v-model="estudiante.genero"
            />
            Femenino
          </label>
        </div>
      </div>

      <!-- Lugar de nacimiento (Distrito primero) -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Lugar de nacimiento
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          
          <!-- 1. Distrito (Buscador Inteligente) -->
          <div class="relative">
            <label class="block text-sm text-gray-600 mb-1">
              Distrito
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="busquedaDistrito"
                @focus="mostrarDropdownDistrito = true"
                @blur="setTimeout(() => mostrarDropdownDistrito = false, 200)"
                @input="verificarInputDistrito"
                placeholder="Buscar distrito..."
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              />
              <i class="pi pi-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            
            <!-- Lista desplegable flotante -->
            <ul
              v-if="mostrarDropdownDistrito"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
            >
              <li
                v-for="distrito in distritosFiltrados"
                :key="distrito.id"
                @click="seleccionarDistrito(distrito)"
                class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition"
              >
                {{ distrito.nombre }}
              </li>
              
              <li v-if="distritosFiltrados.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                No se encontraron resultados
              </li>
            </ul>
          </div>

          <!-- 2. Municipio (Read-only / Autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Municipio
            </label>
            <select
              v-model="estudiante.municipio_id"
              disabled
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            >
              <option :value="null">Seleccione...</option>
              <optgroup v-for="(municipios, idDepto) in listaMunicipios" :key="idDepto">
                <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.id">
                  {{ municipio.nombre }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 3. Departamento (Read-only / Autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Departamento
            </label>
            <select
              v-model="estudiante.departamento_id"
              disabled
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            >
              <option :value="null">Seleccione...</option>
              <option
                v-for="departamento in listaDepartamentos"
                :key="departamento.id"
                :value="departamento.id"
              >
                {{ departamento.nombre }}
              </option>
            </select>
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
          class="w-full px-4 py-2 border rounded-lg resize-none"
          placeholder="Ingrese la dirección completa"
        />
      </div>

      <!-- Teléfono y Correo -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Teléfono
          </label>
          <input
            v-model="estudiante.telefono"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Teléfono"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Correo electrónico
          </label>
          <input
            v-model="estudiante.correo"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="ejemplo@correo.com"
          />
        </div>
      </div>

      <!-- Información de los padres -->
      <div class="border-t pt-6 mt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex justify-between items-center">
          Información de los padres
        </h3>

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
              Padre desconocido
            </label>
          </div>

          <div v-if="!padreDesconocido" class="animate-fade-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Padre
            </label>
            <select
              v-model="estudiante.padre_id"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
            >
              <option :value="null">Seleccione un padre de la lista...</option>
              <!-- Idealmente esto vendrá de tu Pinia Store -->
              <option value="1">Juan Méndez (12345678-9)</option>
              <option value="2">Carlos Ruiz (98765432-1)</option>
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
              Madre desconocida
            </label>
          </div>

          <div v-if="!madreDesconocida" class="animate-fade-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Madre
            </label>
            <select
              v-model="estudiante.madre_id"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
            >
              <option :value="null">Seleccione una madre de la lista...</option>
              <option value="3">Ana Méndez (11223344-5)</option>
              <option value="4">Elena Torres (55667788-9)</option>
            </select>
          </div>
        </div>
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
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar estudiante
        </button>
      </div>
    </form>
  </div>
</template>
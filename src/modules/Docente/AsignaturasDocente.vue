<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { asignacionService } from "../../services/asignacionService";

// M4 (D-A5): materias que el director asignó al docente en sesión, para el año activo.
const carga = ref(null);
const cargando = ref(true);
const error = ref("");

const paleta = [
  { color: "blue", icono: "pi-calculator" },
  { color: "green", icono: "pi-lightbulb" },
  { color: "amber", icono: "pi-book" },
  { color: "violet", icono: "pi-globe" },
  { color: "red", icono: "pi-palette" },
];

const todas = computed(() =>
  (carga.value?.asignaciones ?? []).map((a, i) => ({
    id: a.id,
    nombre: a.asignatura?.nombre ?? "Materia",
    gradoId: a.seccion?.grado?.id ?? a.seccion?.grado_id ?? "",
    seccionId: a.seccion?.id ?? "",
    orden: a.seccion?.grado?.orden ?? 99,
    grado: a.seccion?.grado?.nombre ?? "",
    seccion: a.seccion?.nombre ?? "",
    turno: a.seccion?.turno ?? "",
    estudiantes: a.seccion?.matriculados ?? 0,
    ...paleta[i % paleta.length],
  }))
);

// Filtros (23/10/2026): grado y sección de las asignaturas del docente ("" = todos)
const gradoId = ref("");
const seccionId = ref("");

const grados = computed(() => {
  const unicos = new Map();
  todas.value.forEach((a) => unicos.set(String(a.gradoId), { id: a.gradoId, nombre: a.grado, orden: a.orden }));
  return [...unicos.values()].sort((x, y) => x.orden - y.orden || x.nombre.localeCompare(y.nombre));
});

const secciones = computed(() => {
  const unicas = new Map();
  todas.value
    .filter((a) => !gradoId.value || String(a.gradoId) === String(gradoId.value))
    .forEach((a) => unicas.set(String(a.seccionId), { id: a.seccionId, texto: gradoId.value ? `Sección ${a.seccion}` : `${a.grado} - Sección ${a.seccion}`, orden: a.orden, nombre: a.seccion }));
  return [...unicas.values()].sort((x, y) => x.orden - y.orden || x.nombre.localeCompare(y.nombre));
});

// Al cambiar de grado, la sección elegida se quita si no es de ese grado
watch(gradoId, () => {
  if (seccionId.value && !secciones.value.some((s) => String(s.id) === String(seccionId.value))) seccionId.value = "";
});

const asignaturas = computed(() =>
  todas.value.filter(
    (a) =>
      (!gradoId.value || String(a.gradoId) === String(gradoId.value)) &&
      (!seccionId.value || String(a.seccionId) === String(seccionId.value)),
  ),
);

const anio = computed(() => carga.value?.anio_lectivo?.anio ?? "");

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    carga.value = await asignacionService.miCarga();
  } catch (e) {
    error.value = e.response?.data?.message ?? "No se pudo cargar tu carga académica.";
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const getColorClasses = (color) => {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", from: "from-blue-400", to: "to-blue-600" },
    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
      from: "from-violet-400",
      to: "to-violet-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      from: "from-amber-400",
      to: "to-amber-600",
    },
    red: { bg: "bg-red-100", text: "text-red-600", from: "from-red-400", to: "to-red-600" },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      from: "from-green-400",
      to: "to-green-600",
    },
  };
  return colors[color] || colors.blue;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
  

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">
            Asignaturas Asignadas<span v-if="anio"> - Año lectivo {{ anio }}</span>
          </h2>
          <p v-if="!cargando && !error" class="text-sm text-gray-500">
            Total: {{ asignaturas.length }} asignaturas
          </p>

          <div v-if="todas.length" class="flex flex-wrap gap-3 mt-4">
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">Grado</label>
              <select v-model="gradoId" class="px-4 py-2 border rounded-lg bg-white min-w-[14rem]">
                <option value="">Todos los grados</option>
                <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">Sección</label>
              <select v-model="seccionId" class="px-4 py-2 border rounded-lg bg-white min-w-[14rem]">
                <option value="">Todas las secciones</option>
                <option v-for="s in secciones" :key="s.id" :value="s.id">{{ s.texto }}</option>
              </select>
            </div>
          </div>
        </section>

        <p v-if="cargando" class="text-sm text-gray-500">
          <i class="pi pi-spin pi-spinner mr-2"></i>Cargando asignaturas...
        </p>
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {{ error }}
          <button class="ml-3 underline" @click="cargar">Reintentar</button>
        </div>
        <div
          v-else-if="!carga?.anio_lectivo"
          class="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500"
        >
          No hay un año lectivo activo.
        </div>
        <div
          v-else-if="!todas.length"
          class="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500"
        >
          Aún no tienes materias asignadas en este año lectivo. La dirección registra la carga académica.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div
            v-for="asignatura in asignaturas"
            :key="asignatura.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      getColorClasses(asignatura.color).bg,
                      getColorClasses(asignatura.color).text,
                    ]"
                  >
                    <i :class="['pi', asignatura.icono, 'text-xl']"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 text-lg">{{ asignatura.nombre }}</h3>
                    <p class="text-sm text-gray-500">Asignatura</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-users text-gray-400 text-sm"></i>
                  <span class="text-sm text-gray-700"
                    >{{ asignatura.estudiantes }} estudiantes</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-ticket text-gray-400 text-sm"></i>
                  <span class="text-sm text-gray-700"
                    >{{ asignatura.grado }} - Sección {{ asignatura.seccion }}</span
                  >
                </div>
                <div v-if="asignatura.turno" class="flex items-center gap-2">
                  <i class="pi pi-clock text-gray-400 text-sm"></i>
                  <span class="text-sm text-gray-700 capitalize">{{ asignatura.turno }}</span>
                </div>
              </div>
            </div>
            <div
              :class="[
                'h-1 w-full bg-gradient-to-r',
                getColorClasses(asignatura.color).from,
                getColorClasses(asignatura.color).to,
              ]"
            ></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["cerrar"]);

const profesor = computed(() => profesoresPorSeccion[seccion.value] || "");

const grados = ref([
  "Primer Grado",
  "Segundo Grado",
  "Tercer Grado",
  "Cuarto Grado",
  "Quinto Grado",
  "Sexto Grado",
  "Séptimo Grado",
  "Octavo Grado",
  "Noveno Grado",
  "Primer Año Bachillerato",
  "Segundo Año Bachillerato",
]);
const conducta = ref({
  general: "",
  descripcion: "",
});

const seccionesPorGrado = {
  "Primer Grado": ["A", "B"],
  "Segundo Grado": ["A", "B"],
  "Tercer Grado": ["A", "B"],
  "Cuarto Grado": ["A"],
  "Quinto Grado": ["A"],
  "Sexto Grado": ["A"],
  "Séptimo Grado": ["A", "B"],
  "Octavo Grado": ["A", "B"],
  "Noveno Grado": ["A"],
  "Primer Año Bachillerato": ["A", "B"],
  "Segundo Año Bachillerato": ["A", "B"],
};

const estudiantes = ref([
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "Ana López" },
  { id: 3, nombre: "Carlos Martínez" },
  { id: 4, nombre: "María Hernández" },
]);

const profesoresPorSeccion = {
  A: "Prof. Martínez",
  B: "Prof. López",
  C: "Prof. García",
};

const observaciones = ref("");

const boleta = ref([
  {
    materia: "Matemáticas",
    nota: 8.3,
  },
  {
    materia: "Lenguaje",
    nota: 9.0,
  },
  {
    materia: "Ciencias",
    nota: 8.2,
  },
  {
    materia: "Sociales",
    nota: 8.7,
  },
  {
    materia: "Inglés",
    nota: 9.4,
  },
]);

const promedioGeneral = computed(() => {
  if (!boleta.value.length) return 0;

  const suma = boleta.value.reduce((acc, item) => acc + item.nota, 0);

  return (suma / boleta.value.length).toFixed(2);
});

const periodo = ref("");
const grado = ref("");
const seccion = ref("");
const estudiante = ref("");
const formato = ref("PDF");

const periodosDisponibles = computed(() => {
  if (!grado.value) return [];

  const esBachillerato = grado.value.includes("Bachillerato");

  return esBachillerato
    ? ["Primer Período", "Segundo Período", "Tercer Período", "Cuarto Período"]
    : ["Primer Trimestre", "Segundo Trimestre", "Tercer Trimestre"];
});

const estudianteSeleccionado = computed(() => {
  return estudiantes.value.find((alumno) => alumno.id === estudiante.value);
});

const seccionesDisponibles = computed(() => {
  return seccionesPorGrado[grado.value] || [];
});

watch(grado, () => {
  periodo.value = "";
  seccion.value = "";
  estudiante.value = "";
  observaciones.value = "";
  conducta.value = {
    general: "",
    descripcion: "",
  };
});

const limpiar = () => {
  periodo.value = "";
  grado.value = "";
  seccion.value = "";
  estudiante.value = "";
  observaciones.value = "";
  conducta.value = {
    general: "",
    descripcion: "",
  };
};

const generarReporte = () => {
  if (!grado.value) {
    return;
  }

  if (!seccion.value) {
    return;
  }

  if (!periodo.value) {
    return;
  }

  if (!estudiante.value) {
    return;
  }
  if (!observaciones.value.trim()) {
    return;
  }

  console.log({
    periodo: periodo.value,
    grado: grado.value,
    seccion: seccion.value,
    estudiante: estudiante.value,
    observaciones: observaciones.value,
    promedio: promedioGeneral.value,
    formato: formato.value,
    conducta: conducta.value,
  });
};
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-users text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">REPORTE DE LIBRETA DE NOTAS</h2>
          <p class="text-blue-100">Genere libretas academicas.</p>
        </div>
      </div>

      <form @submit.prevent="generarReporte" class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado</label>
            <div class="relative">
              <i
                class="pi pi-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>
              <select
                v-model="grado"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option disabled value="">Selecciona un grado</option>
                <option v-for="g in grados" :key="g" :value="g">{{ g }}</option>
              </select>
            </div>
          </div>

          <!-- Seccion -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sección</label>
            <div class="relative">
              <i class="pi pi-sitemap absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="seccion"
                @change="actualizarProfesor"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Seleccione una sección</option>
                <option v-for="s in seccionesDisponibles" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Periodo -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Período</label>
            <div class="relative">
              <i class="pi pi-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="periodo"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona un período</option>
                <option v-for="p in periodosDisponibles" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600">Profesor responsable</label>
            <input :value="profesor" disabled class="w-full p-3 border rounded-xl bg-gray-50" />
          </div>
        </div>

        <div class="mt-8">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-user"></i>
            Estudiante
          </h2>

          <div class="relative">
            <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <select
              v-model="estudiante"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 outline-none transition"
            >
              <option value="" disabled>Selecciona un estudiante</option>

              <option v-for="alumno in estudiantes" :key="alumno.id" :value="alumno.id">
                {{ alumno.nombre }}
              </option>
            </select>
          </div>
          <!-- BOLETA PREVIA -->
          <div v-if="estudiante" class="mt-8">
            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <h3 class="font-semibold text-blue-800">Vista previa de boleta</h3>

              <p class="text-sm text-blue-700">
                Estudiante:
                {{ estudianteSeleccionado?.nombre }}
              </p>

              <p class="text-sm text-blue-700 mt-1">{{ grado }} - Sección {{ seccion }}</p>

              <p class="text-sm text-blue-700">
                {{ periodo }}
              </p>
            </div>

            <div class="overflow-hidden border border-gray-200 rounded-2xl">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left">Materia</th>

                    <th class="px-4 py-3 text-left">Calificación</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in boleta" :key="item.materia" class="border-t border-gray-100">
                    <td class="px-4 py-3">
                      {{ item.materia }}
                    </td>

                    <td class="px-4 py-3 font-semibold text-blue-600">
                      {{ item.nota }}
                    </td>
                  </tr>
                </tbody>

                <tfoot class="bg-gray-50">
                  <tr>
                    <td class="px-4 py-3 font-semibold">Promedio General</td>

                    <td class="px-4 py-3 font-bold text-green-600">
                      {{ promedioGeneral }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <!-- CONDUCTA -->
            <div class="mt-6">
              <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i class="pi pi-flag"></i>
                Conducta del Estudiante
              </h2>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Conducta general</label>
                  <input
                    v-model="conducta.general"
                    placeholder="Ej: Buena, Excelente, Regular..."
                    class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-300  outline-none"
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">Descripción</label>
                  <textarea
                    v-model="conducta.descripcion"
                    rows="4"
                    placeholder="Descripción de la conducta del estudiante..."
                    class="w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-gray-300 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Observaciones del Docente
              </label>

              <textarea
                v-model="observaciones"
                rows="5"
                maxlength="500"
                placeholder="Ingrese observaciones sobre el rendimiento académico, conducta o recomendaciones para el estudiante..."
                class="w-full rounded-2xl border border-gray-200 p-4 resize-none focus:ring-2 focus:ring-gray-300 outline-none"
              ></textarea>

              <div class="flex justify-between mt-2">
                <span class="text-xs text-gray-500">
                  Estas observaciones aparecerán en la boleta.
                </span>

                <span class="text-xs text-gray-500"> {{ observaciones.length }}/500 </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="limpiar"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <i class="pi pi-refresh mr-2"></i>
            Limpiar
          </button>

          <button
            type="button"
            @click="emit('cerrar')"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <i class="pi pi-times mr-2"></i>
            Cancelar
          </button>

          <button
            type="submit"
            class="px-6 py-3 border border-blue-600 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition flex items-center gap-2"
          >
            <i class="pi pi-check"></i>
            Generar Reporte
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

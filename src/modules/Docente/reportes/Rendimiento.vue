<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["cerrar"]);

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

const materias = ref(["Matematicas", "Lenguaje", "Ingles"]);

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

const profesor = ref("");

const mostrarBoleta = computed(() => {
  return grado.value && seccion.value && periodo.value && materia.value;
});

const observaciones = ref("");

const estudiantes = ref([
  {
    nombre: "Damaris Martinez",
    seccion: "A",
    materia: "Matematicas",
    nota: 9.3,
  },
  {
    nombre: "Damaris Martinez",
    seccion: "A",
    materia: "Lenguaje",
    nota: 9.0,
  },
  {
    nombre: "Angel Erazo",
    seccion: "A",
    materia: "Matematicas",
    nota: 7.5,
  },
  {
    nombre: "Angel Erazo",
    seccion: "A",
    materia: "Matematicas",
    nota: 2.5,
  },
]);

const boletaFiltrada = computed(() => {
  if (!seccion.value || !materia.value) return [];

  return estudiantes.value.filter(
    (item) => item.seccion === seccion.value && item.materia === materia.value,
  );
});

const promedioGeneral = computed(() => {
  if (!boletaFiltrada.value.length) return 0;

  const suma = boletaFiltrada.value.reduce((acc, item) => acc + item.nota, 0);

  return (suma / boletaFiltrada.value.length).toFixed(2);
});

const estudiantesDestacados = computed(() => {
  return boletaFiltrada.value.filter((alumno) => alumno.nota >= 9);
});

const materia = ref("");
const periodo = ref("");
const grado = ref("");
const seccion = ref("");
const formato = ref("PDF");

const periodosDisponibles = computed(() => {
  if (!grado.value) return [];

  const esBachillerato = grado.value.includes("Bachillerato");

  return esBachillerato
    ? ["Primer Período", "Segundo Período", "Tercer Período", "Cuarto Período"]
    : ["Primer Trimestre", "Segundo Trimestre", "Tercer Trimestre"];
});

const seccionesDisponibles = computed(() => {
  return seccionesPorGrado[grado.value] || [];
});

watch(grado, () => {
  periodo.value = "";
  seccion.value = "";
  materia.value = "";
  observaciones.value = "";
});

const limpiar = () => {
  periodo.value = "";
  grado.value = "";
  seccion.value = "";
  materia.value = "";
  observaciones.value = "";
  profesor.value = "";
};

const generarReporte = () => {
  if (!grado.value) return;
  if (!seccion.value) return;
  if (!periodo.value) return;
  if (!materia.value) return;
  if (!observaciones.value.trim()) return;

  console.log({
    periodo: periodo.value,
    grado: grado.value,
    seccion: seccion.value,
    profesor: profesor.value,
    observaciones: observaciones.value,
    promedio: promedioGeneral.value,
    formato: formato.value,
  });
};
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- HEADER -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-users text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">REPORTE DE RENDIMIENTO ACADEMICO</h2>
          <p class="text-blue-100">Genere boletas academicas.</p>
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

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Seccion</label>
            <div class="relative">
              <i class="pi pi-sitemap absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="seccion"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Seleccione una seccion</option>
                <option v-for="s in seccionesDisponibles" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Periodo</label>
            <div class="relative">
              <i class="pi pi-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="periodo"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona un periodo</option>
                <option v-for="p in periodosDisponibles" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Materia</label>
            <div class="relative">
              <i class="pi pi-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="materia"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona una materia</option>
                <option v-for="m in materias" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600">Profesor responsable</label>

            <input
              v-model="profesor"
              type="text"
              placeholder="Ingrese el nombre del profesor"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            />
          </div>
        </div>

        <div class="mt-8">
          <!-- BOLETA PREVIA -->
          <div v-if="mostrarBoleta" class="mt-8">
            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <h3 class="font-semibold text-blue-800 mb-2">Vista previa de boleta</h3>

              <div class="grid grid-cols-2 gap-2 text-sm text-blue-700">
                <p><strong>Grado:</strong> {{ grado }}</p>
                <p><strong>Sección:</strong> {{ seccion }}</p>
                <p><strong>Materia:</strong> {{ materia }}</p>
                <p><strong>Período:</strong> {{ periodo }}</p>
                <p><strong>Profesor:</strong> {{ profesor }}</p>
                <p><strong>Alumnos:</strong> {{ boletaFiltrada.length }}</p>
              </div>
            </div>

            <div class="overflow-hidden border border-gray-200 rounded-2xl">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left">Alumno</th>

                    <th class="px-4 py-3 text-left">Calificación</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="item in boletaFiltrada"
                    :key="item.nombre"
                    class="border-t border-gray-100"
                  >
                    <td class="px-4 py-3">
                      {{ item.nombre }}
                    </td>

                    <td class="px-4 py-3 font-semibold text-blue-600">
                      {{ item.nota }}
                    </td>
                  </tr>

                  <tr v-if="boletaFiltrada.length === 0">
                    <td colspan="2" class="px-4 py-6 text-center text-gray-500">
                      No hay registros para la selección actual.
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

            <div
              v-if="estudiantesDestacados.length"
              class="mt-6 border border-green-200 bg-green-50 rounded-2xl p-4"
            >
              <h3 class="text-sm font-semibold text-green-700 mb-3">
                Estudiantes Destacados (Promedio ≥ 9.0)
              </h3>

              <div class="space-y-2">
                <div
                  v-for="alumno in estudiantesDestacados"
                  :key="alumno.nombre"
                  class="flex justify-between items-center bg-white rounded-lg px-4 py-2"
                >
                  <span class="text-gray-700">
                    {{ alumno.nombre }}
                  </span>

                  <span class="font-semibold text-green-600">
                    {{ alumno.nota }}
                  </span>
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
            class="px-6 py-3 rounded-xl bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 shadow-md transition flex items-center gap-2"
          >
            <i class="pi pi-check"></i>
            Generar Reporte
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

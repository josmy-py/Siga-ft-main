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

const tiposConducta = ref(["Excelente", "Leve", "Moderado", "Grave"]);

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

const profesor = ref("");

const periodo = ref("");
const grado = ref("");
const seccion = ref("");
const estudiante = ref("");
const formato = ref("PDF");

const conducta = ref("");
const compromiso = ref("");
const observacionesHechos = ref("");
const observacionesAcciones = ref("");

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
  estudiante.value = "";
  conducta.value = "";
});

const limpiar = () => {
  periodo.value = "";
  grado.value = "";
  seccion.value = "";
  estudiante.value = "";
  conducta.value = "";
  observacionesHechos.value = "";
  observacionesAcciones.value = "";
  compromiso.value = "";
  profesor.value = "";
};

const generarReporte = () => {
  if (!grado.value || !seccion.value || !periodo.value || !estudiante.value) return;

  console.log({
    periodo: periodo.value,
    grado: grado.value,
    seccion: seccion.value,
    profesor: profesor.value,
    estudiante: estudiante.value,
    conducta: conducta.value,
    observacionesHechos: observacionesHechos.value,
    observacionesAcciones: observacionesAcciones.value,
    compromiso: compromiso.value,
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
          <h2 class="text-2xl font-bold text-white">Reporte de Conducta</h2>
          <p class="text-blue-100">Generación de reporte disciplinario</p>
        </div>
      </div>

      <!-- FORM -->
      <form @submit.prevent="generarReporte" class="p-8">
        <!-- GRID PRINCIPAL -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- GRADO -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado</label>
            <select
              v-model="grado"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option disabled value="">Selecciona un grado</option>
              <option v-for="g in grados" :key="g" :value="g">
                {{ g }}
              </option>
            </select>
          </div>

          <!-- SECCIÓN -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sección</label>
            <select
              v-model="seccion"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option disabled value="">Selecciona una sección</option>
              <option v-for="s in seccionesDisponibles" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </div>

          <!-- PERIODO -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Período</label>
            <select
              v-model="periodo"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option disabled value="">Selecciona un período</option>
              <option v-for="p in periodosDisponibles" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
          </div>

          <!-- PROFESOR -->
          <!-- PROFESOR -->
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

        <!-- ESTUDIANTE -->
        <div class="mt-8">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-user"></i>
            Estudiante
          </h2>

          <select
            v-model="estudiante"
            class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
          >
            <option disabled value="">Selecciona un estudiante</option>
            <option v-for="alumno in estudiantes" :key="alumno.id" :value="alumno.id">
              {{ alumno.nombre }}
            </option>
          </select>
        </div>

        <!-- CONDUCTA -->
        <div class="mt-8">
          <label class="text-sm font-medium text-gray-700">Tipo de conducta</label>

          <select
            v-model="conducta"
            class="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
          >
            <option disabled value="">Seleccione la conducta</option>
            <option v-for="c in tiposConducta" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <!-- OBSERVACIONES HECHOS -->
        <div class="mt-6">
          <label class="text-sm font-medium text-gray-700">Descripción de los hechos</label>

          <textarea
            v-model="observacionesHechos"
            rows="5"
            maxlength="500"
            placeholder="Describe lo ocurrido..."
            class="w-full mt-2 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-gray-300 outline-none"
          ></textarea>

          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Hechos del incidente</span>
            <span>{{ observacionesHechos.length }}/500</span>
          </div>
        </div>

        <!-- OBSERVACIONES ACCIONES -->
        <div class="mt-6">
          <label class="text-sm font-medium text-gray-700">Acciones tomadas previamente</label>

          <textarea
            v-model="observacionesAcciones"
            rows="5"
            maxlength="500"
            placeholder="Acciones disciplinarias aplicadas..."
            class="w-full mt-2 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-gray-300 outline-none"
          ></textarea>

          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Medidas aplicadas</span>
            <span>{{ observacionesAcciones.length }}/500</span>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Compromisos de Mejora
          </label>

          <textarea
            v-model="compromiso"
            rows="4"
            class="w-full border rounded-md p-3 focus:ring focus:ring-gray-300 focus:outline-none"
            placeholder="Escriba el compromiso del estudiante..."
          ></textarea>
        </div>

        <!-- BOTONES -->
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

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { asignacionService } from "../../services/asignacionService";
import { notasService } from "../../services/notasService";

const route = useRoute();

const asignaciones = ref([]);
const asignacionId = ref("");
const estudiantes = ref([]);
const cargando = ref(true);
const error = ref("");

// Filtros en cascada (23/10/2026): grado -> sección -> asignatura; la asignatura
// elegida es la asignación cuyos estudiantes se listan
const gradoId = ref("");
const seccionId = ref("");
const gradoDe = (a) => String(a.seccion?.grado?.id ?? a.seccion?.grado_id ?? "");
const ordenar = (lista) => lista.sort((x, y) => x.orden - y.orden || x.nombre.localeCompare(y.nombre));

const grados = computed(() => {
  const unicos = new Map();
  asignaciones.value.forEach((a) =>
    unicos.set(gradoDe(a), { id: gradoDe(a), nombre: a.seccion?.grado?.nombre ?? "", orden: a.seccion?.grado?.orden ?? 99 }),
  );
  return ordenar([...unicos.values()]);
});

const secciones = computed(() => {
  const unicas = new Map();
  asignaciones.value
    .filter((a) => gradoDe(a) === String(gradoId.value))
    .forEach((a) => unicas.set(String(a.seccion?.id), { id: String(a.seccion?.id), nombre: a.seccion?.nombre ?? "", orden: 0 }));
  return ordenar([...unicas.values()]);
});

const materias = computed(() =>
  asignaciones.value
    .filter((a) => String(a.seccion?.id) === String(seccionId.value))
    .sort((x, y) => (x.asignatura?.nombre ?? "").localeCompare(y.asignatura?.nombre ?? "")),
);

// Al cambiar el grado o la sección se elige la primera opción disponible
watch(gradoId, () => {
  if (!secciones.value.some((s) => s.id === String(seccionId.value))) seccionId.value = secciones.value[0]?.id ?? "";
});
watch(seccionId, () => {
  if (!materias.value.some((a) => String(a.id) === String(asignacionId.value))) asignacionId.value = materias.value[0]?.id ?? "";
});

const asignacionActual = computed(() =>
  asignaciones.value.find((a) => String(a.id) === String(asignacionId.value))
);

const mensaje = (e, porDefecto) => e.response?.data?.message ?? porDefecto;

const cargarEstudiantes = async () => {
  estudiantes.value = [];
  if (!asignacionId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    const data = await notasService.estudiantes(asignacionId.value);
    estudiantes.value = data.estudiantes;
  } catch (e) {
    error.value = mensaje(e, "No se pudieron cargar los estudiantes.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    const carga = await asignacionService.miCarga();
    asignaciones.value = carga.asignaciones ?? [];
    // Con ?asignacion=ID (desde Notas) se preseleccionan su grado, sección y asignatura
    const pedida = asignaciones.value.find((a) => String(a.id) === String(route.query.asignacion));
    const inicial = pedida ?? asignaciones.value.find((a) => gradoDe(a) === grados.value[0]?.id);
    if (inicial) {
      asignacionId.value = inicial.id;
      seccionId.value = String(inicial.seccion?.id);
      gradoId.value = gradoDe(inicial);
    }
  } catch (e) {
    error.value = mensaje(e, "No se pudo cargar tu carga académica.");
  } finally {
    cargando.value = false;
  }
});

watch(asignacionId, cargarEstudiantes);

// MODAL
const showModal = ref(false);
const selectedStudent = ref(null);

const verEstudiante = (matricula) => {
  selectedStudent.value = matricula.estudiante;
  showModal.value = true;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">

      <div class="flex flex-wrap items-end gap-4 p-4 mt-8">
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Grado</label>
          <select v-model="gradoId" class="px-4 py-2 border rounded-lg bg-white min-w-[12rem]">
            <option v-if="!grados.length" value="">Sin grados</option>
            <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Sección</label>
          <select v-model="seccionId" class="px-4 py-2 border rounded-lg bg-white min-w-[8rem]">
            <option v-if="!secciones.length" value="">Sin secciones</option>
            <option v-for="s in secciones" :key="s.id" :value="s.id">Sección {{ s.nombre }}</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Asignatura</label>
          <select v-model="asignacionId" class="px-4 py-2 border rounded-lg bg-white min-w-[12rem]">
            <option v-if="!materias.length" value="">Sin asignaturas</option>
            <option v-for="a in materias" :key="a.id" :value="a.id">{{ a.asignatura?.nombre ?? "Materia" }}</option>
          </select>
        </div>
        <p v-if="asignacionActual" class="text-sm text-gray-500">
          {{ estudiantes.length }} estudiantes matriculados
        </p>
      </div>

      <div class="p-6">
        <p v-if="cargando" class="text-sm text-gray-500">
          <i class="pi pi-spin pi-spinner mr-2"></i>Cargando estudiantes...
        </p>
        <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p v-else-if="!estudiantes.length" class="text-sm text-gray-500">
          No hay estudiantes con matrícula aprobada en esta sección.
        </p>

        <div v-else class="overflow-x-auto bg-white rounded-2xl border shadow-sm">
          <table class="min-w-full">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-5 py-3 text-left">Nombre</th>
                <th class="px-5 py-3 text-center">NIE</th>
                <th class="px-5 py-3 text-center">Grado</th>
                <th class="px-5 py-3 text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="m in estudiantes" :key="m.id" class="border-t hover:bg-blue-50">
                <td class="px-5 py-4 font-semibold">{{ m.estudiante?.nombre }}</td>
                <td class="px-5 py-4 text-center">{{ m.estudiante?.nie }}</td>
                <td class="px-5 py-4 text-center">
                  {{ asignacionActual?.seccion?.grado?.nombre }} {{ asignacionActual?.seccion?.nombre }}
                </td>
                <td class="px-5 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="verEstudiante(m)"
                      class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-600 hover:text-white transition"
                    >
                      <i class="pi pi-eye"></i>
                      Ver
                    </button>

                    <router-link
                      :to="{ path: '/docente/notas', query: { asignacion: asignacionId } }"
                      class="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      Calificar
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="text-lg font-bold text-gray-800 mb-4">{{ selectedStudent?.nombre }}</h2>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">NIE</dt>
              <dd class="font-medium">{{ selectedStudent?.nie }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Género</dt>
              <dd class="font-medium">{{ selectedStudent?.genero }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Grado</dt>
              <dd class="font-medium">
                {{ asignacionActual?.seccion?.grado?.nombre }} {{ asignacionActual?.seccion?.nombre }}
              </dd>
            </div>
          </dl>
          <div class="mt-6 text-right">
            <button class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200" @click="showModal = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

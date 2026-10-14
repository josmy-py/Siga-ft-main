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

const etiqueta = (a) =>
  `${a.asignatura?.nombre ?? "Materia"} · ${a.seccion?.grado?.nombre ?? ""} ${a.seccion?.nombre ?? ""}`.trim();

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
    const pedida = asignaciones.value.find((a) => String(a.id) === String(route.query.asignacion));
    asignacionId.value = (pedida ?? asignaciones.value[0])?.id ?? "";
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
          <label class="text-sm font-medium text-gray-700 mb-1">Asignatura y sección</label>
          <select v-model="asignacionId" class="px-4 py-2 border rounded-lg">
            <option v-if="!asignaciones.length" value="">Sin asignaturas</option>
            <option v-for="a in asignaciones" :key="a.id" :value="a.id">{{ etiqueta(a) }}</option>
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

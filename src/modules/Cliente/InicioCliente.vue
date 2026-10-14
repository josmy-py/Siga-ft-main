<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { estudianteService } from "../../services/estudianteService";
import { mensajeError } from "../../services/api";
import { useEstadoMatricula } from "../../composables/useEstadoMatricula";

// Inicio del encargado: estado de la matrícula de sus estudiantes
const router = useRouter();
const { estado } = useEstadoMatricula();

const hijos = ref([]);
const cargando = ref(true);
const error = ref("");

const ESTADOS = {
  pendiente: { texto: "Pendiente de revisión", clase: "bg-amber-100 text-amber-700" },
  aprobado: { texto: "Aprobada", clase: "bg-green-100 text-green-700" },
  rechazado: { texto: "Rechazada", clase: "bg-red-100 text-red-700" },
};

const AVISOS = {
  pendiente: "Su solicitud de matrícula está pendiente. Cuando la dirección la apruebe podrá consultar notas y asignaturas.",
  aprobada: "La matrícula está aprobada. Consulte la libreta de notas y las asignaturas de su estudiante.",
  sin_matricula: "Aún no tiene una solicitud de matrícula en el año actual. Registre a su estudiante y envíe la solicitud.",
};
const aviso = computed(() => AVISOS[estado.value] ?? AVISOS.sin_matricula);

onMounted(async () => {
  try {
    hijos.value = await estudianteService.listar();
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar sus estudiantes.");
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-800">Inicio</h1>
        <p class="text-gray-500 text-sm">{{ aviso }}</p>
      </div>
    </header>

    <div class="p-6 space-y-6">
      <div v-if="estado !== 'aprobada'" class="flex flex-wrap gap-3">
        <button class="px-4 py-2 rounded-lg border hover:bg-gray-100" @click="router.push({ name: 'registro-cliente' })">
          <i class="pi pi-user-plus mr-2"></i>Registrar estudiante
        </button>
        <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="router.push({ name: 'matricula-cliente' })">
          <i class="pi pi-file-plus mr-2"></i>Solicitud de matrícula
        </button>
      </div>

      <p v-if="cargando" class="text-gray-500">Cargando…</p>
      <p v-else-if="error" class="text-red-600">{{ error }}</p>
      <p v-else-if="!hijos.length" class="text-gray-500">Aún no ha registrado estudiantes.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="hijo in hijos" :key="hijo.id" class="bg-white rounded-2xl shadow p-5">
          <p class="font-semibold text-gray-800"><i class="pi pi-user mr-2 text-blue-600"></i>{{ hijo.nombre }}</p>
          <p class="text-xs text-gray-500 mt-1">NIE {{ hijo.nie || "—" }}</p>
          <div class="mt-3 text-sm">
            <span
              v-if="hijo.ultima_matricula"
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="ESTADOS[hijo.ultima_matricula.estado]?.clase"
            >
              Matrícula {{ hijo.ultima_matricula.anio_lectivo?.nombre }}: {{ ESTADOS[hijo.ultima_matricula.estado]?.texto }}
            </span>
            <span v-else class="text-gray-500">Sin solicitud de matrícula</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

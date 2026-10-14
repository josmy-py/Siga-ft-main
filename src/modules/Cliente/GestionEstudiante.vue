<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { matriculaService, TURNOS } from "../../services/matriculaService";
import { mensajeError } from "../../services/api";
import ComprobanteMatricula from "../../components/ComprobanteMatricula.vue";

// M6: solicitudes de matrícula de la cuenta (API real)
const router = useRouter();

const matriculas = ref([]);
const cargando = ref(true);
const error = ref("");
const comprobanteId = ref(null);

const ESTADOS = {
  pendiente: { texto: "Pendiente", clase: "bg-amber-100 text-amber-700" },
  aprobado: { texto: "Aprobada", clase: "bg-green-100 text-green-700" },
  rechazado: { texto: "Rechazada", clase: "bg-red-100 text-red-700" },
};

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    matriculas.value = (await matriculaService.listar()).matriculas;
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar las solicitudes.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const cancelar = async (m) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Cancelar la solicitud?",
    text: `Se eliminará la solicitud de ${m.estudiante?.nombre} con sus archivos.`,
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await matriculaService.cancelar(m.id);
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo cancelar") });
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 md:flex">
    <main class="flex-1 transition-all duration-300">
      <div class="mb-8 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4">
          <h1 class="text-3xl font-bold text-gray-800">Solicitud de Matrícula</h1>
          <p class="text-gray-500 text-sm">Consulte el estado de sus solicitudes. La sección la asigna la dirección.</p>
        </div>
      </div>

      <div class="p-6">
        <div class="flex justify-end mb-6">
          <button
            class="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md"
            @click="router.push({ name: 'matriculas-cliente' })"
          >
            <i class="pi pi-file-edit"></i>
            Matricular
          </button>
        </div>

        <p v-if="cargando" class="text-gray-500">Cargando…</p>
        <p v-else-if="error" class="text-red-600">{{ error }}</p>
        <p v-else-if="!matriculas.length" class="text-gray-500">Aún no tiene solicitudes de matrícula.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="m in matriculas"
            :key="m.id"
            class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <i class="pi pi-user text-2xl text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800">{{ m.estudiante?.nombre }}</h3>
                <p class="text-xs text-gray-500">NIE {{ m.estudiante?.nie || "—" }}</p>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Estado</span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="ESTADOS[m.estado]?.clase">
                  {{ ESTADOS[m.estado]?.texto ?? m.estado }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Año lectivo</span>
                <span class="font-medium text-gray-800">{{ m.anio_lectivo?.nombre || "—" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Ingreso</span>
                <span class="font-medium text-gray-800">{{ m.ingreso }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Grado y sección</span>
                <span class="font-medium text-gray-800 text-right">
                  <template v-if="m.seccion">{{ m.seccion.grado?.nombre }} {{ m.seccion.nombre }}</template>
                  <template v-else>Por asignar (dirección)</template>
                </span>
              </div>
              <div v-if="m.seccion" class="flex justify-between">
                <span class="text-gray-500">Turno</span>
                <span class="font-medium text-gray-800">{{ TURNOS[m.seccion.turno] ?? m.seccion.turno }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-5">
              <button
                v-if="m.estado === 'pendiente'"
                class="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                @click="cancelar(m)"
              >
                Cancelar solicitud
              </button>
              <button
                class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                @click="comprobanteId = m.id"
              >
                Comprobante
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ComprobanteMatricula v-if="comprobanteId" :matricula-id="comprobanteId" @cerrar="comprobanteId = null" />
  </div>
</template>

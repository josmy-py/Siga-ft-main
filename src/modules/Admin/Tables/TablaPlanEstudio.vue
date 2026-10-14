<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { planEstudioService } from "@/services/catalogoService";
import { mensajeError } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

defineProps({
  // Plan cuyas materias están abiertas debajo de la tabla
  planSeleccionadoId: { type: Number, default: null },
});

const emit = defineEmits(["editar", "materias", "eliminado"]);
const auth = useAuthStore();

const Planes = ref([]);
const filtros = ref({ vigente: "" });
const cargando = ref(false);
const errorCarga = ref(null);

const cargar = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const parametros = {};
    if (filtros.value.vigente !== "") parametros.vigente = filtros.value.vigente;
    Planes.value = await planEstudioService.listar(parametros);
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los planes de estudio");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
defineExpose({ cargar });

const fecha = (valor) => (valor ? valor.split("-").reverse().join("/") : "");

const eliminar = async (plan) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar el plan de estudio?",
    text: `Se eliminará "${plan.nombre}". Solo es posible si no tiene materias registradas.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await planEstudioService.delete(plan.id);
    await cargar();
    emit("eliminado", plan);
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo eliminar el plan de estudio") });
  }
};
</script>

<template>
  <div class="w-full p-4 md:p-6">

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <h2 class="text-2xl font-bold text-gray-800">Planes de Estudio</h2>
          <p class="text-gray-500 text-sm mt-1">
            Las materias de cada plan son las que se asignan a las secciones.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="filtros.vigente" @change="cargar" class="h-11 px-3 border border-gray-200 rounded-xl">
            <option value="">Vigentes y no vigentes</option>
            <option value="1">Solo vigentes</option>
            <option value="0">Solo no vigentes</option>
          </select>
        </div>

      </div>

      <div v-if="errorCarga" class="m-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ errorCarga }}
      </div>

      <div class="overflow-x-auto">

        <table class="w-full min-w-[820px]">

          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Especialidad</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vigencia</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Materias</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="cargando && !Planes.length">
              <td colspan="5" class="text-center py-6 text-slate-500">Cargando planes de estudio...</td>
            </tr>
            <tr v-else-if="!Planes.length">
              <td colspan="5" class="text-center py-6 text-slate-500">No hay planes de estudio con estos filtros.</td>
            </tr>

            <tr
              v-for="plan in Planes"
              :key="plan.id"
              class="border-t transition"
              :class="plan.id === planSeleccionadoId ? 'bg-emerald-50' : 'hover:bg-slate-50'"
            >
              <td class="px-6 py-4 min-w-[200px]">
                <div class="font-medium text-gray-800">{{ plan.nombre }}</div>
                <div class="text-xs text-gray-500 max-w-xs truncate" :title="plan.descripcion">{{ plan.descripcion }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ plan.especialidad?.nombre ?? "—" }}</td>
              <td class="px-6 py-4 text-gray-700 text-sm whitespace-nowrap">
                {{ fecha(plan.fecha_inicio) }} – {{ fecha(plan.fecha_fin) }}
                <div class="text-xs text-gray-400 mb-1">Aprobado: {{ fecha(plan.fecha_aprobacion) }}</div>
                <span
                  class="px-3 py-0.5 rounded-full text-xs font-medium"
                  :class="plan.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ plan.estado ? "Vigente" : "No vigente" }}
                </span>
              </td>
              <td class="px-6 py-4 text-center font-semibold text-gray-700">{{ plan.asignaturas_count }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-col items-stretch gap-2">
                  <button
                    @click="emit('materias', plan)"
                    class="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                  >
                    <i class="pi pi-book"></i>
                    Materias
                  </button>
                  <template v-if="auth.esDirector">
                    <button
                      @click="emit('editar', plan)"
                      class="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                    >
                      <i class="pi pi-pencil"></i>
                      Editar
                    </button>
                    <button
                      @click="eliminar(plan)"
                      class="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                    >
                      <i class="pi pi-trash"></i>
                      Eliminar
                    </button>
                  </template>
                </div>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <div class="p-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <span class="text-sm text-gray-500">
          Total de planes:
          <strong class="text-gray-800">{{ Planes.length }}</strong>
        </span>
        <span class="text-sm text-indigo-600 font-medium">Catálogo Académico</span>
      </div>

    </div>

  </div>
</template>

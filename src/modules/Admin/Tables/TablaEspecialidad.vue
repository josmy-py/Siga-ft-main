<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { especialidadService } from "@/services/catalogoService";
import { mensajeError } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits(["editar"]);
const auth = useAuthStore();

const Especialidades = ref([]);
const busqueda = ref("");
const cargando = ref(false);
const errorCarga = ref(null);

const filtradas = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();
  return texto ? Especialidades.value.filter((e) => e.nombre.toLowerCase().includes(texto)) : Especialidades.value;
});

const cargar = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const { especialidades } = await especialidadService.getAll();
    Especialidades.value = [...especialidades].sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar las especialidades");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
defineExpose({ cargar });

const eliminar = async (especialidad) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar la especialidad?",
    text: `Se eliminará "${especialidad.nombre}". Solo es posible si no tiene matrículas ni planes de estudio.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await especialidadService.delete(especialidad.id);
    await cargar();
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo eliminar la especialidad") });
  }
};
</script>

<template>
  <div class="w-full p-4 md:p-6">

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            Especialidades Registradas
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            Especialidades que ofrece la institución; los planes de bachillerato y las matrículas las usan.
          </p>
        </div>

        <div class="relative w-full md:w-80">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar especialidad..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

      </div>

      <div v-if="errorCarga" class="m-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ errorCarga }}
      </div>

      <div class="overflow-x-auto">

        <table class="w-full">

          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Especialidad</th>
              <th v-if="auth.esDirector" class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="cargando && !Especialidades.length">
              <td colspan="2" class="text-center py-6 text-slate-500">Cargando especialidades...</td>
            </tr>
            <tr v-else-if="!filtradas.length">
              <td colspan="2" class="text-center py-6 text-slate-500">
                {{ busqueda ? "Ninguna especialidad coincide con la búsqueda." : "No hay especialidades registradas." }}
              </td>
            </tr>

            <tr
              v-for="especialidad in filtradas"
              :key="especialidad.id"
              class="border-t hover:bg-slate-50 transition"
            >

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <i class="pi pi-star text-blue-600"></i>
                  </div>
                  <span class="font-medium text-gray-700">{{ especialidad.nombre }}</span>
                </div>
              </td>

              <td v-if="auth.esDirector" class="px-6 py-4">
                <div class="flex justify-center gap-3">
                  <button
                    @click="emit('editar', especialidad)"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                  >
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>
                  <button
                    @click="eliminar(especialidad)"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                  >
                    <i class="pi pi-trash"></i>
                    Eliminar
                  </button>
                </div>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <div class="p-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <span class="text-sm text-gray-500">
          Total de especialidades:
          <strong class="text-gray-800">{{ Especialidades.length }}</strong>
        </span>
        <span class="text-sm text-blue-600 font-medium">Catálogo Académico</span>
      </div>

    </div>

  </div>
</template>

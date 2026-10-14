<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import { asignaturaService } from "@/services/catalogoService";
import { mensajeError } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

// M2.5 (D-C1): materias del plan de estudios abierto
const props = defineProps({
  plan: { type: Object, required: true },
});

const emit = defineEmits(["editar", "cambio"]);
const auth = useAuthStore();

const Materias = ref([]);
const busqueda = ref("");
const cargando = ref(false);
const errorCarga = ref(null);

const filtradas = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();
  return texto ? Materias.value.filter((m) => m.nombre.toLowerCase().includes(texto)) : Materias.value;
});

const cargar = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    Materias.value = await asignaturaService.delPlan(props.plan.id);
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar las materias del plan");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
watch(() => props.plan.id, cargar);
defineExpose({ cargar });

const eliminar = async (materia) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar la materia?",
    text: `Se eliminará "${materia.nombre}" del plan. Solo es posible si no tiene docentes asignados.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await asignaturaService.delete(materia.id);
    await cargar();
    emit("cambio");
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo eliminar la materia") });
  }
};
</script>

<template>
  <div class="w-full p-4 md:p-6">

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            Materias de {{ plan.nombre }}
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ plan.especialidad ? `${plan.especialidad.nombre} · ` : "" }}
            {{ plan.estado ? "plan vigente: estas materias se podrán asignar a las secciones" : "plan no vigente" }}
          </p>
        </div>

      </div>

      <div class="p-5">

        <div class="flex justify-end">
          <div class="relative w-full md:w-80">

            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar materia..."
              class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

          </div>
        </div>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">

        <table class="w-full">

          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nombre
              </th>

              <th v-if="auth.esDirector" class="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="errorCarga">
              <td colspan="2" class="px-6 py-4 text-red-700 bg-red-50 text-sm">{{ errorCarga }}</td>
            </tr>
            <tr v-else-if="cargando && !Materias.length">
              <td colspan="2" class="text-center py-6 text-slate-500">Cargando materias...</td>
            </tr>
            <tr v-else-if="!filtradas.length">
              <td colspan="2" class="text-center py-6 text-slate-500">
                {{ busqueda ? "Ninguna materia coincide con la búsqueda." : "Este plan aún no tiene materias." }}
              </td>
            </tr>

            <tr
              v-for="materia in filtradas"
              :key="materia.id"
              class="border-t hover:bg-slate-50 transition"
            >

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">

                  <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <i class="pi pi-book text-emerald-600"></i>
                  </div>

                  <span class="font-medium text-gray-700">
                    {{ materia.nombre }}
                  </span>

                </div>
              </td>

              <td v-if="auth.esDirector" class="px-6 py-4">
                <div class="flex justify-center gap-3">

                  <button
                    @click="emit('editar', materia)"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                  >
                    <i class="pi pi-pencil"></i>
                    Renombrar
                  </button>

                  <button
                    @click="eliminar(materia)"
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
          Total de materias:
          <strong class="text-gray-800">{{ Materias.length }}</strong>
        </span>

        <span class="text-sm text-emerald-600 font-medium">
          Catálogo Académico
        </span>

      </div>

    </div>

  </div>
</template>

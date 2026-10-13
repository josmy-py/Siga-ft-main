<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { gradoService } from "@/services/catalogoService";
import { mensajeError } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits(["editar", "eliminado"]);
const auth = useAuthStore();

// La API los devuelve en orden académico (orden del catálogo oficial)
const Grados = ref([]);
const busqueda = ref("");
const cargando = ref(false);
const errorCarga = ref(null);

const filtrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();
  return texto ? Grados.value.filter((g) => g.nombre.toLowerCase().includes(texto)) : Grados.value;
});

const nivel = (orden) => {
  if (orden === null || orden === undefined) return { texto: "Fuera del catálogo", clase: "bg-slate-100 text-slate-600" };
  if (orden <= 0) return { texto: "Parvularia", clase: "bg-pink-100 text-pink-700" };
  if (orden <= 9) return { texto: "Educación Básica", clase: "bg-indigo-100 text-indigo-700" };
  return { texto: "Bachillerato", clase: "bg-amber-100 text-amber-700" };
};

const cargar = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const { grados } = await gradoService.getAll();
    Grados.value = grados;
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los grados");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
defineExpose({ cargar });

const eliminar = async (grado) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar el grado?",
    text: `Se eliminará "${grado.nombre}". Solo es posible si no tiene secciones ni planes de estudio.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await gradoService.delete(grado.id);
    await cargar();
    emit("eliminado");
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, "No se pudo eliminar el grado") });
  }
};
</script>

<template>
  <div class="w-full p-4 md:p-6">

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            Grados Registrados
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            Grados oficiales registrados, en orden de promoción.
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
              placeholder="Buscar grado..."
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

              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nivel
              </th>

              <th v-if="auth.esDirector" class="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="errorCarga">
              <td colspan="3" class="px-6 py-4 text-red-700 bg-red-50 text-sm">{{ errorCarga }}</td>
            </tr>
            <tr v-else-if="cargando && !Grados.length">
              <td colspan="3" class="text-center py-6 text-slate-500">Cargando grados...</td>
            </tr>
            <tr v-else-if="!filtrados.length">
              <td colspan="3" class="text-center py-6 text-slate-500">
                {{ busqueda ? "Ningún grado coincide con la búsqueda." : "No hay grados registrados. Regístrelos desde el catálogo oficial." }}
              </td>
            </tr>

            <tr
              v-for="grado in filtrados"
              :key="grado.id"
              class="border-t hover:bg-slate-50 transition"
            >

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">

                  <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <i class="pi pi-graduation-cap text-indigo-600"></i>
                  </div>

                  <span class="font-medium text-gray-700">
                    {{ grado.nombre }}
                  </span>

                </div>
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-sm font-medium" :class="nivel(grado.orden).clase">
                  {{ nivel(grado.orden).texto }}
                </span>
              </td>

              <td v-if="auth.esDirector" class="px-6 py-4">
                <div class="flex justify-center gap-3">

                  <button
                    @click="emit('editar', grado)"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                  >
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>

                  <button
                    @click="eliminar(grado)"
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
          Total de grados:
          <strong class="text-gray-800">{{ Grados.length }}</strong>
        </span>

        <span class="text-sm text-indigo-600 font-medium">
          Catálogo Académico
        </span>

      </div>

    </div>

  </div>
</template>

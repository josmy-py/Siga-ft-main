<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import Estudiantes from "@/modules/Admin/Estudiantes.vue";
import RegistroCliente from "@/modules/Cliente/RegistroCliente.vue";
import { estudianteService } from "@/services/estudianteService";
import { mensajeError } from "@/services/api";

// Estudiantes de la dirección (19/10/2026): solo los que tienen una matrícula
// aprobada y por eso están activos. Los inscritos (registrados por el encargado
// sin matrícula aprobada) se atienden desde Matrículas. Búsqueda por nombre o NIE.
const estudiantes = ref([]);
const cargando = ref(true);
const error = ref("");

const search = ref("");

const fichaId = ref(null);
const edicionId = ref(null);

const etiquetaEstado = {
  inscrito: "Inscrito",
  activo: "Activo",
  inactivo: "Inactivo",
  egresado: "Egresado",
  graduado: "Graduado",
};

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    estudiantes.value = await estudianteService.listar({ q: search.value.trim(), estado: "activo", con_matricula_aprobada: 1 });
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar los estudiantes.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const limpiar = () => {
  search.value = "";
  cargar();
};

const guardado = async (mensaje) => {
  edicionId.value = null;
  Swal.fire({ icon: "success", title: mensaje, timer: 2000, showConfirmButton: false });
  await cargar();
};

</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Estudiantes</h1>
          </div>
        </div>
      </header>

      <div class="p-4 lg:p-6">
        <section class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-700">Listado de Estudiantes</h2>
          <p class="text-sm text-gray-500 mb-4">Estudiantes activos: con una matrícula aprobada.</p>

          <form class="flex flex-wrap gap-3 mb-5" @submit.prevent="cargar">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por nombre o NIE"
              class="flex-1 min-w-[220px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <button type="submit" class="bg-blue-600 border border-transparent hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Buscar
            </button>

            <button
              type="button"
              class="bg-gray-200 border border-gray-400 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              @click="limpiar"
            >
              Limpiar
            </button>
          </form>

          <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>

          <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table class="w-full text-left">
              <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th class="p-3">Nombre</th>
                  <th class="p-3">NIE</th>
                  <th class="p-3">Cuenta</th>
                  <th class="p-3">Estado</th>
                  <th class="p-3">Año</th>
                  <th class="p-3">Grado</th>
                  <th class="p-3">Sección</th>
                  <th class="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="cargando">
                  <td colspan="8" class="p-6 text-center text-gray-500"><i class="pi pi-spin pi-spinner mr-2"></i>Cargando...</td>
                </tr>
                <tr v-else-if="!estudiantes.length">
                  <td colspan="8" class="p-6 text-center text-gray-500">No hay estudiantes activos con estos datos.</td>
                </tr>
                <tr v-for="est in cargando ? [] : estudiantes" :key="est.id" class="border-t hover:bg-gray-50">
                  <td class="p-3">{{ est.nombre }}</td>
                  <td class="p-3">{{ est.nie || "—" }}</td>
                  <td class="p-3 text-sm">{{ est.user?.email || "—" }}</td>
                  <td class="p-3">{{ etiquetaEstado[est.estado] ?? est.estado }}</td>
                  <td class="p-3">{{ est.ultima_matricula?.anio_lectivo?.anio || "—" }}</td>
                  <td class="p-3">{{ est.ultima_matricula?.seccion?.grado?.nombre || "—" }}</td>
                  <td class="p-3">{{ est.ultima_matricula?.seccion?.nombre || "—" }}</td>

                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-3">
                      <button
                        @click="fichaId = est.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-eye"></i>
                        Ver
                      </button>

                      <button
                        @click="edicionId = est.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <Estudiantes v-if="fichaId" :estudiante-id="fichaId" @cerrar="fichaId = null" @cambiado="cargar" />

    <div v-if="edicionId" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Editar estudiante</h2>
        <RegistroCliente :estudiante-id="edicionId" sin-padres @cerrar="edicionId = null" @guardado="guardado" />
      </div>
    </div>
  </div>
</template>

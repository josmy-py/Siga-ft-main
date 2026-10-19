<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import FormProfesores from "../Forms/Profesores.vue";
import { profesorService } from "@/services/profesorService";
import { mensajeError } from "@/services/api";

const activeSection = ref("Profesores");
const search = ref("");

const mostrarModal = ref(false);
const profesorEditado = ref(null);

const profesores = ref([]);
const cargando = ref(false);
const errorCarga = ref(null);

const cargarProfesores = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    profesores.value = await profesorService.listar(search.value.trim());
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los profesores");
  } finally {
    cargando.value = false;
  }
};

// Búsqueda por nombre, código o DUI en el backend
let temporizador = null;
watch(search, () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarProfesores, 350);
});

onMounted(cargarProfesores);

const abrirCrear = () => {
  profesorEditado.value = null;
  mostrarModal.value = true;
};

const abrirEditar = (profesor) => {
  profesorEditado.value = profesor;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  profesorEditado.value = null;
};

const alGuardar = async (mensaje) => {
  cerrarModal();
  await cargarProfesores();
  Swal.fire({ icon: "success", title: mensaje, timer: 3000, showConfirmButton: false });
};

const ejecutar = async (accion, porDefecto) => {
  try {
    const { message } = await accion();
    await cargarProfesores();
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, porDefecto) });
  }
};

const eliminar = async (profesor) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar al profesor?",
    text: `Se eliminará ${profesor.codigo}; su cuenta de usuario se conserva. Solo es posible si no tiene secciones ni asignaciones.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  await ejecutar(() => profesorService.eliminar(profesor.id), "No se pudo eliminar el profesor");
};

const tabClass = (name) => [
  "px-8 py-2 rounded-t-[24px] border border-transparent font-semibold text-lg transition-all duration-200",
  activeSection.value === name
    ? "bg-white text-slate-900 relative z-20 -mb-[2px]"
    : "bg-slate-200 text-slate-600 hover:bg-slate-300",
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
    <main class="transition-all duration-300 p-6">
      <header class="mb-6">
        <div>
          <h1 class="text-4xl font-bold text-slate-900">Profesores</h1>

          <p class="text-slate-500 mt-2">Gestión de profesores y asignaciones.</p>
        </div>
      </header>

      <nav class="flex gap-4 mb-0">
        <button :class="tabClass('Profesores')" @click="activeSection = 'Profesores'">
          Profesores
        </button>
      </nav>

      <div class="bg-white rounded-b-3xl rounded-r-3xl shadow-xl p-6 overflow-hidden">
        <section v-if="activeSection === 'Profesores'">
          <div class="flex items-center gap-4 mb-6">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por nombre, código o DUI..."
              class="w-full max-w-sm h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />

            <button
              @click="abrirCrear"
              class="ml-auto h-11 px-5 rounded-lg bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition"
            >
              + Agregar
            </button>
          </div>

          <div v-if="errorCarga" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorCarga }}
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Código</th>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Nombre</th>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">DUI</th>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Teléfono</th>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Cuenta</th>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="cargando && !profesores.length">
                  <td colspan="6" class="text-center py-6 text-slate-500">Cargando profesores...</td>
                </tr>

                <tr v-else-if="!profesores.length">
                  <td colspan="6" class="text-center py-6 text-slate-500">No se encontraron profesores.</td>
                </tr>

                <tr
                  v-for="profesor in profesores"
                  :key="profesor.id"
                  class="hover:bg-slate-50"
                >
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700 font-medium whitespace-nowrap">{{ profesor.codigo }}</td>
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">{{ profesor.nombre }}</td>
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">{{ profesor.dui }}</td>
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">{{ profesor.telefono }}</td>
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">{{ profesor.user?.email }}</td>
                  <td class="px-6 py-4 border-b border-slate-200">
                    <div class="flex justify-center flex-wrap gap-2">
                      <button
                        @click="abrirEditar(profesor)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                      <button
                        @click="eliminar(profesor)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
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

          <FormProfesores v-if="mostrarModal" :profesor="profesorEditado" @cerrar="cerrarModal" @guardado="alGuardar" />
        </section>
      </div>
    </main>
  </div>
</template>

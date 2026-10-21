<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import RegistroCliente from "./RegistroCliente.vue";
import { estudianteService } from "../../services/estudianteService";
import { mensajeError } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";

// M5: estudiantes registrados por la cuenta del encargado (API real)
const router = useRouter();
const auth = useAuthStore();

const hijos = ref([]);
const cargando = ref(true);
const error = ref("");
const abrirRegistro = ref(false);
const editado = ref(null);

const etiquetaEstado = {
  inscrito: "Registrado, sin matrícula aprobada",
  activo: "Matriculado",
  inactivo: "Inactivo",
  egresado: "Egresado",
  graduado: "Graduado",
};

const nombreCuenta = computed(() => auth.user?.email ?? "su cuenta");

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    hijos.value = await estudianteService.listar();
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar sus estudiantes.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const nuevo = () => {
  editado.value = null;
  abrirRegistro.value = true;
};

const editar = (hijo) => {
  editado.value = hijo;
  abrirRegistro.value = true;
};

const cerrarRegistro = () => {
  abrirRegistro.value = false;
  editado.value = null;
};

const guardado = async (mensaje) => {
  cerrarRegistro();
  Swal.fire({ icon: "success", title: mensaje, timer: 2200, showConfirmButton: false });
  await cargar();
};

const eliminar = async (hijo) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar el registro?",
    text: `Se eliminará a ${hijo.nombre} y sus vínculos con padres. Solo es posible si no tiene matrículas.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await estudianteService.eliminar(hijo.id);
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo eliminar") });
  }
};

const matricular = (hijo) => router.push({ name: "matriculas-cliente", query: { estudiante: hijo.id } });
const familia = (hijo) => router.push({ name: "registro-padres", query: { estudiante: hijo.id } });
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">
      <div v-if="!abrirRegistro" class="p-6">
        

        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Registro</h2>
              <p class="text-gray-500 text-sm mt-1">
                Estudiantes registrados por {{ nombreCuenta }}
              </p>
            </div>

            <button
              @click="nuevo"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <i class="pi pi-user-plus"></i>
              Registrar
            </button>
          </div>

          <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ error }} <button class="underline ml-2" @click="cargar">Reintentar</button>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div v-if="cargando" class="p-10 text-center text-gray-500">
              <i class="pi pi-spin pi-spinner mr-2"></i>Cargando estudiantes...
            </div>

            <div
              v-for="hijo in cargando ? [] : hijos"
              :key="hijo.id"
              class="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-user text-blue-600 text-lg"></i>
                </div>

                <div>
                  <h3 class="font-semibold text-gray-800">
                    {{ hijo.nombre }}
                  </h3>

                  <p class="text-sm text-gray-500">
                    {{ etiquetaEstado[hijo.estado] ?? hijo.estado }}
                    · NIE: {{ hijo.nie || "pendiente" }}
                    · {{ hijo.padres_count }} padre(s)/madre(s)
                    <span v-if="hijo.ultima_matricula">
                      · Matrícula {{ hijo.ultima_matricula.anio_lectivo?.anio }}: {{ hijo.ultima_matricula.estado }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  @click="familia(hijo)"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  title="Padres y madres"
                >
                  <i class="pi pi-users"></i>
                  Familia
                </button>
                <button
                  @click="editar(hijo)"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  <i class="pi pi-pencil"></i>
                  Editar
                </button>
                <button
                  v-if="!hijo.matriculas_count"
                  @click="eliminar(hijo)"
                  class="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <i class="pi pi-trash"></i>
                  Eliminar
                </button>
            
                <button
                  v-if="hijo.estado === 'inscrito'"
                  @click="matricular(hijo)"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <i class="pi pi-check"></i>
                  Matricular
                </button>
              </div>
            </div>

            <div v-if="!cargando && hijos.length === 0" class="p-10 text-center text-gray-500">
              No hay estudiantes registrados.
            </div>
          </div>
        </div>
      </div>

      <div v-else class="min-h-screen flex items-start justify-center p-6">
        <div class="w-full max-w-4xl">
          <div class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ editado ? "Editar estudiante" : "Registro de Estudiante" }}
                </h2>
                <p class="text-gray-500 text-sm mt-1">
                  Completa el formulario para {{ editado ? "actualizar los datos del" : "registrar un" }} estudiante.
                </p>
              </div>
            </div>
            <RegistroCliente :estudiante-id="editado?.id ?? null" @cerrar="cerrarRegistro" @guardado="guardado" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

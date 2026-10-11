<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const modalTipoMatriculaOpen = ref(false);

const abrirTipoMatricula = () => {
  modalTipoMatriculaOpen.value = true;
};

const cerrarTipoMatricula = () => {
  modalTipoMatriculaOpen.value = false;
};

const irAMatriculaConTipo = (tipo) => {
  cerrarTipoMatricula();
  router.push({
    name: "matriculas-cliente",
    query: {
      tipo: tipo === "nuevo" ? "nuevo" : "antiguo",
    },
  });
};

const estudiantes = ref([
  {
    nombres: "María Fernanda Gómez Ruiz",
    estadoMatricula: "Pendiente",
    grado: "4° Grado",
    turno: "Matutino",
  },
  {
    nombres: "José Antonio Hernández",
    estadoMatricula: "Aprobada",
    grado: "6° Grado",
    turno: "Vespertino",
  },
]);
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 md:flex">
    <main class="flex-1 transition-all duration-300">
      <div class="mb-8 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Solicitud de Matrícula</h1>
            <p class="text-gray-500 text-sm">Consulta el estado de las solicitudes de matrícula</p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="flex justify-end mb-6">
          <button
            @click="router.push({ name: 'matriculas-cliente' })"
            class="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md"
          >
            <i class="pi pi-file-edit"></i>
            Matricular
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="(estudiante, index) in estudiantes"
            :key="index"
            class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <i class="pi pi-user text-2xl text-blue-600"></i>
              </div>

              <h3 class="font-bold text-lg text-gray-800">
                {{ estudiante.nombres }}
              </h3>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-500">Estado</span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                >
                  {{ estudiante.estadoMatricula }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-500">Grado</span>
                <span class="font-medium text-gray-800">
                  {{ estudiante.grado }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-500">Turno</span>
                <span class="font-medium text-gray-800">
                  {{ estudiante.turno }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="modalTipoMatriculaOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Tipo de Matrícula</h2>

          <button
            @click="cerrarTipoMatricula"
            class="p-2 hover:bg-gray-100 rounded-full -mt-1 -mr-1"
          >
            <i class="pi pi-times text-xl text-gray-500"></i>
          </button>
        </div>

        <p class="text-gray-500 mb-5 text-sm">
          Selecciona el tipo de matrícula que deseas realizar.
        </p>

        <div class="space-y-4">
          <button
            @click="irAMatriculaConTipo('nuevo')"
            class="w-full border border-blue-100 rounded-xl p-5 hover:bg-blue-50/50 transition text-left shadow-sm"
          >
            <div class="flex items-center gap-4">
              <i class="pi pi-user-plus text-2xl text-blue-600"></i>
              <div>
                <h3 class="font-bold text-gray-800">Nuevo Ingreso</h3>
                <p class="text-sm text-gray-500 mt-0.5">Estudiantes que ingresan por primera vez</p>
              </div>
            </div>
          </button>

          <button
            @click="irAMatriculaConTipo('antiguo')"
            class="w-full border border-violet-100 rounded-xl p-5 hover:bg-violet-50/50 transition text-left shadow-sm"
          >
            <div class="flex items-center gap-4">
              <i class="pi pi-sync text-2xl text-violet-600"></i>
              <div>
                <h3 class="font-bold text-gray-800">Antiguo Ingreso</h3>
                <p class="text-sm text-gray-500 mt-0.5">
                  Estudiantes que continúan en la institución
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

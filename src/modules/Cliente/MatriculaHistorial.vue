<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["close"]);

const modalVerMatriculaOpen = ref(false);
const matriculaSeleccionada = ref(null);

const matriculas = ref([
  {
    id: 1,
    estudiante: "Juan Carlos Pérez",
    año: "2024",
    grado: "Primero",
    especialidad: "Básica",
    turno: "Mañana",
    tipo: "nuevo",
    estado: "pendiente",
    fecha: "2024-01-15",
    nie: "12345678",
  },
  {
    id: 2,
    estudiante: "María Ruiz",
    año: "2024",
    grado: "Segundo",
    especialidad: "Bachillerato General",
    turno: "Tarde",
    tipo: "antiguo",
    estado: "aprobada",
    fecha: "2024-01-20",
    nie: "87654321",
  },
]);

const verMatricula = (matricula) => {
  matriculaSeleccionada.value = matricula;
  modalVerMatriculaOpen.value = true;
};

const cerrarVerMatricula = () => {
  modalVerMatriculaOpen.value = false;
  matriculaSeleccionada.value = null;
};

const abrirFormulario = () => {
  if (!matriculaSeleccionada.value) return;

  const tipoFormulario = ["nuevo", "antiguo"].includes(matriculaSeleccionada.value.tipo)
    ? matriculaSeleccionada.value.tipo
    : "nuevo";

  router.push({
    name: "matriculas-cliente",
    path: "/cliente/matriculas",
    query: {
      id: matriculaSeleccionada.value.id,
      estudiante: matriculaSeleccionada.value.estudiante,
      NIE: matriculaSeleccionada.value.nie,
      tipo: tipoFormulario,
    },
  });

  cerrarVerMatricula();
};
const volver = () => {
  emit("close");
};
</script>

<template>
  <div class="p-6">
    <div class="flex items-center gap-4 mb-6">
      <button
        @click="volver"
        class="p-2 rounded-lg border border-transparent hover:bg-gray-100 transition text-gray-600"
      >
        <i class="pi pi-arrow-left text-xl"></i>
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Historial de Matrículas</h2>
        <p class="text-gray-500 text-sm">Visualiza las matrículas realizadas</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="matricula in matriculas"
        :key="matricula.id"
        class="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        @click="verMatricula(matricula)"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-semibold text-gray-800">{{ matricula.estudiante }}</h3>
          <span
            :class="[
              'px-2 py-1 text-xs rounded-full font-medium',
              matricula.estado === 'aprobada'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700',
            ]"
          >
            {{ matricula.estado === "aprobada" ? "Aprobada" : "Pendiente" }}
          </span>
        </div>
        <div class="text-sm text-gray-500 space-y-1">
          <p>Grado: {{ matricula.grado }} - {{ matricula.especialidad }}</p>
          <p>Turno: {{ matricula.turno }} | Año: {{ matricula.año }}</p>
          <p class="text-xs">Fecha: {{ matricula.fecha }}</p>
        </div>
      </div>
    </div>

    <div v-if="matriculas.length === 0" class="text-center py-12">
      <p class="text-gray-500">No hay matrículas registradas</p>
    </div>

    <div
      v-if="modalVerMatriculaOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Detalles de Matrícula</h2>
          </div>

          <div v-if="matriculaSeleccionada" class="space-y-4">
            <div class="text-center mb-4">
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold inline-block',
                  matriculaSeleccionada.estado === 'aprobada'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700',
                ]"
              >
                {{
                  matriculaSeleccionada.estado === "aprobada"
                    ? "Matrícula Aprobada"
                    : "Matrícula Pendiente"
                }}
              </span>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-600 mb-2">Estudiante</h3>
              <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.estudiante }}</p>
              <p class="text-sm text-gray-500">NIE: {{ matriculaSeleccionada.nie }}</p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-600 mb-3">Detalles</h3>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-gray-500">Año:</span>
                  <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.año }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Grado:</span>
                  <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.grado }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Especialidad:</span>
                  <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.especialidad }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Turno:</span>
                  <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.turno }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Tipo:</span>
                  <p class="text-gray-800 font-medium capitalize">
                    {{ matriculaSeleccionada.tipo }} ingreso
                  </p>
                </div>
                <div>
                  <span class="text-gray-500">Fecha:</span>
                  <p class="text-gray-800 font-medium">{{ matriculaSeleccionada.fecha }}</p>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="cerrarVerMatricula"
                class="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cerrar
              </button>

              <button
                @click="abrirFormulario"
                class="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Editar Matrícula
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

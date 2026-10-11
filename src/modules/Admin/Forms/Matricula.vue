<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["cerrar", "aprobar", "rechazar"]);

const estudiante = ref({
  nombre: "Juan Pérez",
  lugarNacimiento: "San Salvador",
  direccion: "Colonia Escalón",
  correo: "juan@gmail.com",
  tipoIngreso: "nuevo",
  anioAplicacion: "2026",
  especialidad: "Educacion Basica",
  grado: "3°",

  discapacidad: true,
  descripcionDiscapacidad: "Problema auditivo",

  enfermedad: true,
  descripcionEnfermedad: "Asma",

  medicamentos: true,
  descripcionMedicamentos: "Salbutamol",
});

const encargado = ref({
  nombre: " Maria Leticia Gonzales",
  parentesco: "Madre",
  dui: "09016543-4",
});

const secciones = ref([
  { id: 1, nombre: "A", grado: "3°" },
  { id: 2, nombre: "B", grado: "3°" },
  { id: 3, nombre: "C", grado: "3°" },
  { id: 4, nombre: "A", grado: "4°" },
]);

const profesores = ref([
  { id: 1, nombre: "Carlos López", seccionId: 1 },
  { id: 2, nombre: "Ana Martínez", seccionId: 2 },
  { id: 3, nombre: "Luis García", seccionId: 3 },
]);

const materiasBasica = ["Matemática", "Lenguaje", "Ciencias Naturales", "Estudios Sociales", "Inglés"];

const materiasIntermedia = [
  "Matemática",
  "Lenguaje",
  "Ciencias Naturales",
  "Estudios Sociales",
  "Inglés",
  "Física",
  "Química",
  "Biología",
];

const materiasSeleccionadas = ref([]);

const matricula = ref({
  seccion: "",
  profesor: "",
});

const gradoNumero = computed(() => {
  return parseInt(estudiante.value.grado);
});

const esBasica = computed(() => gradoNumero.value <= 9);
const esNuevoIngreso = computed(() => estudiante.value.tipoIngreso === "nuevo");
const seccionesDisponibles = computed(() => {
  return secciones.value.filter((s) => s.grado === estudiante.value.grado);
});

const profesorAsignado = computed(() => {
  return profesores.value.find((p) => p.seccionId === Number(matricula.value.seccion)) || null;
});

const materiasAsignadas = computed(() => {
  return esBasica.value ? materiasBasica : materiasIntermedia;
});

watch(
  materiasAsignadas,
  (nuevas) => {
    materiasSeleccionadas.value = [...nuevas];
  },
  { immediate: true },
);

const resumen = computed(() => ({
  estudiante: estudiante.value.nombre,
  ingreso: estudiante.value.tipoIngreso,
  especialidad: estudiante.value.especialidad,
  grado: estudiante.value.grado,

  seccion: secciones.value.find((s) => s.id === Number(matricula.value.seccion))?.nombre || "",

  profesor: profesorAsignado.value?.nombre || "",

  materias: materiasSeleccionadas.value,

  encargado: encargado.value,
}));

const aprobarMatricula = () => {
  if (!matricula.value.seccion) {
    alert("Debe seleccionar una sección");
    return;
  }

  emit("aprobar", {
    estudiante: estudiante.value,
    matricula: matricula.value,
    materias: materiasSeleccionadas.value,
  });
};

const rechazarMatricula = () => emit("rechazar", estudiante.value);
const cerrarFormulario = () => emit("cerrar");
</script>

<template>
  <div class="p-6 space-y-6">
<div class="grid grid-cols-1 gap-6">
  <div class="bg-white rounded-xl p-8 shadow-lg ring-1 ring-gray-200">

    <div class="flex items-center gap-2 mb-6">
      <i class="pi pi-user text-blue-600"></i>
      <h2 class="font-semibold text-gray-800">Datos del Estudiante</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

      <div class="flex flex-col items-center gap-4 mt-10">
        <div v-if="estudiante.foto">
          <img
            :src="estudiante.foto"
            class="w-36 h-36 rounded-full object-cover border-4 border-blue-100 shadow"
          />
        </div>

        <div v-else class="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border">
          Sin foto
        </div>
      </div>

      <div class="md:col-span-2 space-y-4">

        <div>
          <label class="block text-sm text-gray-600 mb-1">Nombre Completo</label>
          <input
            :value="estudiante.nombre"
            disabled
            class="w-full p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Lugar de Nacimiento</label>
          <input
            :value="estudiante.lugarNacimiento"
            disabled
            class="w-full p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Dirección</label>
          <input
            :value="estudiante.direccion"
            disabled
            class="w-full p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="block text-sm text-gray-600 mb-1">Correo</label>
            <input
              :value="estudiante.correo"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">NIE</label>

            <input
              v-if="esNuevoIngreso"
              v-model="estudiante.nie"
              class="w-full p-3 border rounded-xl"
              placeholder="Ingrese NIE"
            />

            <input
              v-else
              :value="estudiante.nie"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

        </div>

      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-2 gap-6">

        <div class="bg-white rounded-xl p-8 shadow-lg ring-1 ring-gray-200">
        <div class="flex items-center gap-2 mb-6">
          <i class="pi pi-users text-indigo-500"></i>
          <h2 class="font-semibold text-gray-800">Datos del Encargado</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1"> Nombre </label>

            <input
              :value="
                encargado.nombre"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Parentesco </label>

            <input
              :value="encargado.parentesco"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> DUI </label>

            <input
              :value="encargado.dui"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-8 shadow-lg ring-1 ring-gray-200">
        <div class="flex items-center gap-2 mb-6">
          <i class="pi pi-heart text-red-500"></i>
          <h2 class="font-semibold text-gray-800">Información de Salud</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1"> Discapacidad </label>

            <input
              :value="
                estudiante.discapacidad
                  ? estudiante.descripcionDiscapacidad
                  : 'No posee discapacidad'
              "
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Enfermedad </label>

            <input
              :value="
                estudiante.enfermedad ? estudiante.descripcionEnfermedad : 'No posee enfermedades'
              "
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Medicamentos </label>

            <input
              :value="
                estudiante.medicamentos
                  ? estudiante.descripcionMedicamentos
                  : 'No toma medicamentos'
              "
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>
        </div>
      </div>
</div>

    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white rounded-xl p-8 shadow-lg ring-1 ring-gray-200">
        <div class="flex items-center gap-2 mb-6">
          <i class="pi pi-graduation-cap text-indigo-600"></i>
          <h2 class="font-semibold text-gray-800">Información Académica</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1"> Tipo de Ingreso </label>

            <input
              :value="estudiante.tipoIngreso"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Año de Aplicación </label>

            <input
              :value="estudiante.anioAplicacion"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Especialidad </label>

            <input
              :value="estudiante.especialidad"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"> Grado </label>

            <input
              :value="estudiante.grado"
              disabled
              class="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1"> Sección </label>

              <select v-model="matricula.seccion" class="w-full p-3 border rounded-xl">
                <option value="">Seleccione</option>

                <option
                  v-for="seccion in seccionesDisponibles"
                  :key="seccion.id"
                  :value="seccion.id"
                >
                  {{ seccion.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1"> Profesor  </label>

              <input
                :value="profesorAsignado?.nombre || ''"
                disabled
                class="w-full p-3 border rounded-xl bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-8 shadow-lg ring-1 ring-gray-200">
        <div class="flex items-center gap-2 mb-6">
          <i class="pi pi-book text-green-600"></i>
          <h2 class="font-semibold text-gray-800">Materias Asignadas</h2>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="materia in materiasAsignadas"
            :key="materia"
            class="flex items-center justify-between p-3 border rounded-xl bg-slate-50"
          >
            <span class="font-medium text-gray-700">
              {{ materia }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-200">
      <div class="flex items-center gap-2 mb-6">
        <i class="pi pi-file text-blue-600"></i>
        <h2 class="font-semibold text-gray-800">Resumen de Matrícula</h2>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-500"> Estudiante </label>

          <p class="font-medium">
            {{ resumen.estudiante }}
          </p>
        </div>

        <div>
          <label class="block text-sm text-gray-500"> Especialidad </label>

          <p class="font-medium">
            {{ resumen.especialidad }}
          </p>
        </div>

        <div>
          <label class="block text-sm text-gray-500"> Grado </label>

          <p class="font-medium">
            {{ resumen.grado }}
          </p>
        </div>

        <div>
          <label class="block text-sm text-gray-500"> Sección </label>

          <p class="font-medium">
            {{ resumen.seccion || "Pendiente" }}
          </p>
        </div>

        <div>
          <label class="block text-sm text-gray-500"> Profesor </label>

          <p class="font-medium">
            {{ resumen.profesor || "Pendiente" }}
          </p>
        </div>

        <div>
          <label class="block text-sm text-gray-500"> Total Materias </label>

          <p class="font-medium">
            {{ materiasAsignadas.length }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button @click="cerrarFormulario" class="px-5 py-3 border border border-gray-400 rounded-xl">
        Cancelar
      </button>

      <button
        @click="rechazarMatricula"
        class="px-5 py-3 bg-red-500 border border-red-500 text-white rounded-xl"
      >
        Rechazar
      </button>

      <button
        @click="aprobarMatricula"
        class="px-5 py-3 bg-green-500 border border-green-500 text-white rounded-xl"
      >
        Aprobar Matrícula
      </button>
    </div>
  </div>
</template>

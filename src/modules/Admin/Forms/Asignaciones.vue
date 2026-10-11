<script setup>
import { ref } from "vue";

const emit = defineEmits(["cerrar"]);

const guardarAsignacion = () => {};

const filtros = ref({
  profesor: "",
});

const gradosSeleccionados = ref([]);
const materiasSeleccionadas = ref([]);
const seccionesSeleccionadas = ref([]);

const grados = ["7° Grado", "8° Grado", "9° Grado", "1° Bachillerato", "2° Bachillerato"];

const materias = [
  "Matemática",
  "Lenguaje",
  "Ciencias",
  "Estudios Sociales",
  "Inglés",
  "Informática",
];

const secciones = [
  "7° A",
  "7° B",
  "8° A",
  "8° B",
  "9° A",
  "9° B",
  "1° Bach A",
  "1° Bach B",
  "2° Bach A",
];
</script>

<template>
  <div class="p-6 space-y-6">
    <section
      class="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm"
    >
      <div
        class="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"
      ></div>

      <div class="relative p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-user text-white text-2xl"></i>
            </div>

            <div>
              <h2 class="text-xl font-bold text-slate-800">Profesor Encargado</h2>

              <p class="text-slate-500 text-sm">
                Seleccione el docente responsable de la asignación académica
              </p>
            </div>
          </div>

          <div
            class="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl"
          >
            <i class="pi pi-info-circle"></i>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-slate-700"> Profesor </label>

          <div class="relative">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

            <select
              v-model="filtros.profesor"
              class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all"
            >
              <option value="">Seleccione un profesor</option>

              <option value="Ana Marta Gonzalez">Ana Marta Gonzalez</option>

              <option value="Julio Francisco">Julio Francisco</option>
            </select>
          </div>

          <p class="text-xs text-slate-400">
            El docente seleccionado recibirá las materias, grados y secciones elegidas.
          </p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-2 xl:grid-cols-2 gap-6">
      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <i class="pi pi-graduation-cap text-blue-600 text-xl"></i>
            </div>

            <div>
              <h3 class="font-bold text-slate-800">Grados</h3>
              <p class="text-sm text-slate-500">Seleccione los grados asignados</p>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="grid gap-3">
            <label
              v-for="grado in grados"
              :key="grado"
              :class="[
                'relative cursor-pointer rounded-2xl border-2 p-4 py-2 transition-all duration-200',
                gradosSeleccionados.includes(grado)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50',
              ]"
            >
              <input type="checkbox" :value="grado" v-model="gradosSeleccionados" class="hidden" />

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-slate-800">{{ grado }}</p>
                  <p class="text-xs text-slate-500 mt-1">Nivel académico</p>
                </div>

                <div
                  v-if="gradosSeleccionados.includes(grado)"
                  class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"
                >
                  <i class="pi pi-check text-white text-sm"></i>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <i class="pi pi-book text-emerald-600 text-xl"></i>
            </div>

            <div>
              <h3 class="font-bold text-slate-800">Materias</h3>
              <p class="text-sm text-slate-500">Seleccione las materias</p>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="grid gap-3">
            <label
              v-for="materia in materias"
              :key="materia"
              :class="[
                'relative cursor-pointer rounded-2xl border-2 p-4 py-2 transition-all duration-200',
                materiasSeleccionadas.includes(materia)
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50',
              ]"
            >
              <input
                type="checkbox"
                :value="materia"
                v-model="materiasSeleccionadas"
                class="hidden"
              />

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-slate-800">{{ materia }}</p>
                  <p class="text-xs text-slate-500 mt-1">Asignatura</p>
                </div>

                <div
                  v-if="materiasSeleccionadas.includes(materia)"
                  class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"
                >
                  <i class="pi pi-check text-white text-sm"></i>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-1 gap-6">
      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
              <i class="pi pi-users text-violet-600 text-xl"></i>
            </div>

            <div>
              <h3 class="font-bold text-slate-800">Secciones</h3>
              <p class="text-sm text-slate-500">Seleccione las secciones</p>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="seccion in secciones"
              :key="seccion"
              :class="[
                'cursor-pointer rounded-2xl border-2 p-4 py-2 text-center transition-all duration-200',
                seccionesSeleccionadas.includes(seccion)
                  ? 'border-violet-500 bg-violet-50 shadow-md'
                  : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50',
              ]"
            >
              <input
                type="checkbox"
                :value="seccion"
                v-model="seccionesSeleccionadas"
                class="hidden"
              />

              <div class="flex items-center justify-center gap-2">
                <span class="font-bold text-lg text-slate-800">
                  {{ seccion }}
                </span>

                <i
                  v-if="seccionesSeleccionadas.includes(seccion)"
                  class="pi pi-check-circle text-violet-600"
                ></i>
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="emit('cerrar')"
        class="px-4 border border-gray-500 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl transition"
      >
        Cancelar
      </button>

      <button
        @click="guardarAsignacion"
        class="px-5 py-3 bg-green-500 border border-green-500 text-white rounded-xl"
      >
        Aprobar Asignación
      </button>
    </div>
  </div>
</template>
